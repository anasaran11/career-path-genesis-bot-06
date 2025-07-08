
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.recruiter_profiles CASCADE;
DROP TABLE IF EXISTS public.student_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 🌟 1. User Profiles (Enhanced)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  city TEXT,
  email TEXT,
  mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 2. Education History
CREATE TABLE public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  degree TEXT,
  institution TEXT,
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 3. Skills (Central Dictionary)
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- 🌟 4. Profile-Specific Skills
CREATE TABLE public.profile_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  level INTEGER CHECK (level >= 0 AND level <= 100),
  UNIQUE(profile_id, skill_id)
);

-- 🌟 5. Work Experience
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  company TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 6. Certifications
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  credential_id TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 7. Job Preferences
CREATE TABLE public.job_prefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  desired_roles TEXT[],
  preferred_cities TEXT[],
  salary_expectation TEXT,
  work_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 8. AI Career Recommendations
CREATE TABLE public.career_recs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  salary_range TEXT,
  growth TEXT CHECK (growth IN ('Low', 'Medium', 'High')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 9. Skill Gaps
CREATE TABLE public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  missing_skill TEXT,
  importance TEXT CHECK (importance IN ('Low', 'Medium', 'High')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 10. Advisory Reports (AI Roadmap)
CREATE TABLE public.advisory_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_text TEXT,
  report_type TEXT DEFAULT 'career_roadmap',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 🌟 11. Fetched Job Posts (Enhanced)
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  source_url TEXT,
  description TEXT,
  summary TEXT,
  salary TEXT,
  job_type TEXT,
  experience_level TEXT,
  requirements TEXT[],
  benefits TEXT[],
  posted_at DATE,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired'))
);

-- 🌟 12. Job Applications (Enhanced)
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  resume_url TEXT,
  cover_letter_url TEXT,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'shortlisted', 'interviewed', 'rejected', 'hired')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(profile_id, job_id)
);

-- 🔒 Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_prefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 🔐 RLS Policies for profiles
CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 🔐 RLS Policies for educations
CREATE POLICY "Users can manage their own education" ON public.educations
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for skills (public read, no write for regular users)
CREATE POLICY "Everyone can view skills" ON public.skills FOR SELECT USING (true);

-- 🔐 RLS Policies for profile_skills
CREATE POLICY "Users can manage their own profile skills" ON public.profile_skills
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for experiences
CREATE POLICY "Users can manage their own experiences" ON public.experiences
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for certifications
CREATE POLICY "Users can manage their own certifications" ON public.certifications
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for job_prefs
CREATE POLICY "Users can manage their own job preferences" ON public.job_prefs
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for career_recs
CREATE POLICY "Users can view their own career recommendations" ON public.career_recs
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for skill_gaps
CREATE POLICY "Users can view their own skill gaps" ON public.skill_gaps
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for advisory_reports
CREATE POLICY "Users can view their own reports" ON public.advisory_reports
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔐 RLS Policies for jobs (public read for active jobs)
CREATE POLICY "Everyone can view active jobs" ON public.jobs
  FOR SELECT USING (status = 'active');

-- 🔐 RLS Policies for applications
CREATE POLICY "Users can manage their own applications" ON public.applications
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- 🔧 Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- 🔧 Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 📊 Create function to get full profile (for AI processing)
CREATE OR REPLACE FUNCTION public.get_full_profile(uid UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'profile', p.*,
    'educations', (SELECT json_agg(e) FROM public.educations e WHERE e.profile_id = p.id),
    'skills', (
      SELECT json_agg(json_build_object('name', s.name, 'level', ps.level))
      FROM public.profile_skills ps
      JOIN public.skills s ON s.id = ps.skill_id
      WHERE ps.profile_id = p.id
    ),
    'experiences', (SELECT json_agg(x) FROM public.experiences x WHERE x.profile_id = p.id),
    'certifications', (SELECT json_agg(c) FROM public.certifications c WHERE c.profile_id = p.id),
    'job_prefs', (SELECT row_to_json(jp) FROM public.job_prefs jp WHERE jp.profile_id = p.id)
  )
  FROM public.profiles p
  WHERE p.user_id = uid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- 🌱 Insert some initial skills for healthcare/pharma
INSERT INTO public.skills (name) VALUES
  ('Clinical Research'),
  ('GCP Training'),
  ('Medical Writing'),
  ('Pharmacovigilance'),
  ('Regulatory Affairs'),
  ('Clinical Data Management'),
  ('Statistical Analysis'),
  ('Project Management'),
  ('Patient Care'),
  ('Laboratory Techniques'),
  ('Drug Development'),
  ('Quality Assurance'),
  ('Healthcare Technology'),
  ('Patient Communication'),
  ('Team Leadership')
ON CONFLICT (name) DO NOTHING;
