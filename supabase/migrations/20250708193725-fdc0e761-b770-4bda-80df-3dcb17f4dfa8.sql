
-- Add custom authentication and credit system tables
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL UNIQUE,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update profiles table to include credits and custom auth
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE,
ADD COLUMN password_hash TEXT,
ADD COLUMN credits INTEGER DEFAULT 3,
ADD COLUMN institution_id UUID REFERENCES public.institutions(id),
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN first_login BOOLEAN DEFAULT true;

-- Create table for tracking credit usage
CREATE TABLE public.credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('job_scan', 'credit_purchase')),
  credits_consumed INTEGER DEFAULT 0,
  credits_added INTEGER DEFAULT 0,
  remaining_credits INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for ZaneProEd courses
CREATE TABLE public.zane_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  duration TEXT,
  course_id TEXT UNIQUE NOT NULL,
  key_skills TEXT[],
  price DECIMAL(10,2),
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zane_courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for institutions (public read)
CREATE POLICY "Everyone can view approved institutions" ON public.institutions
  FOR SELECT USING (approved = true);

-- RLS Policies for credit_usage
CREATE POLICY "Users can view their own credit usage" ON public.credit_usage
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for zane_courses (public read for active courses)
CREATE POLICY "Everyone can view active courses" ON public.zane_courses
  FOR SELECT USING (active = true);

-- Insert some sample institutions
INSERT INTO public.institutions (name, domain) VALUES
  ('ZaneProEd University', 'zaneproed.edu'),
  ('Healthcare College of Excellence', 'hce.edu'),
  ('Pharmaceutical Institute', 'pharminst.edu'),
  ('Medical Sciences University', 'meduni.edu'),
  ('Clinical Research Academy', 'cra.edu');

-- Insert sample ZaneProEd courses
INSERT INTO public.zane_courses (title, summary, duration, course_id, key_skills, price, level) VALUES
  ('Clinical Research Fundamentals', 'Complete introduction to clinical research principles and GCP guidelines', '8 weeks', 'crf-001', ARRAY['GCP', 'Clinical Trials', 'Regulatory Compliance'], 299.00, 'Beginner'),
  ('Pharmacovigilance Mastery', 'Advanced drug safety monitoring and adverse event reporting', '6 weeks', 'pv-002', ARRAY['Drug Safety', 'Adverse Events', 'Regulatory Reporting'], 399.00, 'Intermediate'),
  ('Medical Writing Professional', 'Scientific writing for regulatory submissions and publications', '10 weeks', 'mw-003', ARRAY['Medical Writing', 'Regulatory Documents', 'Scientific Communication'], 499.00, 'Advanced'),
  ('Healthcare Data Analytics', 'Data analysis and visualization for healthcare professionals', '12 weeks', 'hda-004', ARRAY['Data Analysis', 'Healthcare Informatics', 'Statistical Software'], 599.00, 'Intermediate'),
  ('Regulatory Affairs Certification', 'Complete regulatory strategy and submission processes', '16 weeks', 'ra-005', ARRAY['Regulatory Strategy', 'FDA Guidelines', 'Drug Approval'], 799.00, 'Advanced');

-- Function to consume credits
CREATE OR REPLACE FUNCTION public.consume_credit(user_profile_id UUID)
RETURNS JSON AS $$
DECLARE
  current_credits INTEGER;
  profile_record RECORD;
BEGIN
  -- Get current profile with credits
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_profile_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Profile not found');
  END IF;
  
  current_credits := profile_record.credits;
  
  IF current_credits <= 0 THEN
    RETURN json_build_object('error', 'No credits remaining', 'remaining_credits', 0);
  END IF;
  
  -- Deduct one credit
  UPDATE public.profiles 
  SET credits = credits - 1 
  WHERE id = user_profile_id;
  
  -- Log the usage
  INSERT INTO public.credit_usage (profile_id, action_type, credits_consumed, remaining_credits)
  VALUES (user_profile_id, 'job_scan', 1, current_credits - 1);
  
  RETURN json_build_object('success', true, 'remaining_credits', current_credits - 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (for purchases)
CREATE OR REPLACE FUNCTION public.add_credits(user_profile_id UUID, credits_to_add INTEGER)
RETURNS JSON AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  -- Add credits
  UPDATE public.profiles 
  SET credits = credits + credits_to_add 
  WHERE id = user_profile_id
  RETURNING credits INTO new_credits;
  
  -- Log the purchase
  INSERT INTO public.credit_usage (profile_id, action_type, credits_added, remaining_credits)
  VALUES (user_profile_id, 'credit_purchase', credits_to_add, new_credits);
  
  RETURN json_build_object('success', true, 'remaining_credits', new_credits);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
