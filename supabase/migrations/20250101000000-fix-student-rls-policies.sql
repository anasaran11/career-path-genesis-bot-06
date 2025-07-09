-- Fix RLS policies to work with custom student authentication
-- This allows students table IDs to be used as user_id in profiles

-- Drop existing restrictive policy for profiles
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;

-- Create new policies that allow both Supabase auth users and students to manage profiles
CREATE POLICY "Auth users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can manage profiles with their student ID" ON public.profiles
  FOR ALL USING (
    user_id IN (SELECT id FROM public.students)
  ) WITH CHECK (
    user_id IN (SELECT id FROM public.students)
  );

-- Update related table policies to also work with student IDs
-- Drop and recreate educations policies
DROP POLICY IF EXISTS "Users can manage their own education" ON public.educations;
CREATE POLICY "Auth users can manage their own education" ON public.educations
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can manage their own education" ON public.educations
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  );

-- Drop and recreate profile_skills policies
DROP POLICY IF EXISTS "Users can manage their own profile skills" ON public.profile_skills;
CREATE POLICY "Auth users can manage their own profile skills" ON public.profile_skills
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can manage their own profile skills" ON public.profile_skills
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  );

-- Drop and recreate experiences policies
DROP POLICY IF EXISTS "Users can manage their own experiences" ON public.experiences;
CREATE POLICY "Auth users can manage their own experiences" ON public.experiences
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can manage their own experiences" ON public.experiences
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  );

-- Drop and recreate certifications policies
DROP POLICY IF EXISTS "Users can manage their own certifications" ON public.certifications;
CREATE POLICY "Auth users can manage their own certifications" ON public.certifications
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can manage their own certifications" ON public.certifications
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  );

-- Drop and recreate job_prefs policies
DROP POLICY IF EXISTS "Users can manage their own job preferences" ON public.job_prefs;
CREATE POLICY "Auth users can manage their own job preferences" ON public.job_prefs
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can manage their own job preferences" ON public.job_prefs
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  ) WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM public.students))
  );
