
-- Create students table for custom authentication
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT NOT NULL,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy for students to view their own data
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (id = auth.uid()::uuid);

-- Create RPC function to verify login credentials
CREATE OR REPLACE FUNCTION public.verify_login(input_username TEXT, input_password TEXT)
RETURNS JSON AS $$
DECLARE
  student_record RECORD;
BEGIN
  -- Find student with matching username and password
  SELECT * INTO student_record 
  FROM public.students 
  WHERE username = input_username AND password = input_password;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Invalid credentials');
  END IF;
  
  -- Update last login timestamp
  UPDATE public.students 
  SET last_login = now() 
  WHERE id = student_record.id;
  
  -- Return student data (excluding password)
  RETURN json_build_object(
    'success', true,
    'student', json_build_object(
      'id', student_record.id,
      'username', student_record.username,
      'full_name', student_record.full_name,
      'email', student_record.email,
      'institution', student_record.institution,
      'credits', student_record.credits
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample students for testing
INSERT INTO public.students (username, password, full_name, email, institution, credits) VALUES
  ('john_doe', 'password123', 'John Doe', 'john.doe@zaneproed.edu', 'ZaneProEd University', 3),
  ('jane_smith', 'mypassword', 'Jane Smith', 'jane.smith@hce.edu', 'Healthcare College of Excellence', 2),
  ('mike_johnson', 'securepass', 'Mike Johnson', 'mike.johnson@pharminst.edu', 'Pharmaceutical Institute', 5);
