-- Create service function to handle student profile creation and updates
-- This function runs with elevated privileges to bypass RLS restrictions

CREATE OR REPLACE FUNCTION public.create_or_update_student_profile(
  student_uuid UUID,
  profile_data JSON
)
RETURNS JSON AS $$
DECLARE
  profile_record RECORD;
  profile_id UUID;
BEGIN
  -- Check if student exists
  IF NOT EXISTS (SELECT 1 FROM public.students WHERE id = student_uuid) THEN
    RETURN json_build_object('error', 'Student not found');
  END IF;
  
  -- Insert or update profile (bypassing RLS due to SECURITY DEFINER)
  INSERT INTO public.profiles (user_id, name, email, mobile, city, updated_at)
  VALUES (
    student_uuid,
    profile_data->>'name',
    profile_data->>'email',
    profile_data->>'mobile',
    profile_data->>'city',
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    mobile = EXCLUDED.mobile,
    city = EXCLUDED.city,
    updated_at = now()
  RETURNING * INTO profile_record;
  
  profile_id := profile_record.id;
  
  -- Return success with profile ID
  RETURN json_build_object(
    'success', true,
    'profile_id', profile_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', 'Failed to create/update profile: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle student education data
CREATE OR REPLACE FUNCTION public.update_student_education(
  student_uuid UUID,
  education_data JSON
)
RETURNS JSON AS $$
DECLARE
  profile_id UUID;
  education_item JSON;
BEGIN
  -- Get profile ID for the student
  SELECT id INTO profile_id 
  FROM public.profiles 
  WHERE user_id = student_uuid;
  
  IF profile_id IS NULL THEN
    RETURN json_build_object('error', 'Profile not found for student');
  END IF;
  
  -- Delete existing education records
  DELETE FROM public.educations WHERE profile_id = profile_id;
  
  -- Insert new education records
  FOR education_item IN SELECT * FROM json_array_elements(education_data)
  LOOP
    INSERT INTO public.educations (profile_id, degree, institution, end_year)
    VALUES (
      profile_id,
      education_item->>'degree',
      education_item->>'institution',
      CASE 
        WHEN education_item->>'end_year' != '' 
        THEN (education_item->>'end_year')::INTEGER 
        ELSE NULL 
      END
    );
  END LOOP;
  
  RETURN json_build_object('success', true);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', 'Failed to update education: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle student skills
CREATE OR REPLACE FUNCTION public.update_student_skills(
  student_uuid UUID,
  skills_data TEXT[]
)
RETURNS JSON AS $$
DECLARE
  profile_id UUID;
  skill_name TEXT;
  skill_id UUID;
BEGIN
  -- Get profile ID for the student
  SELECT id INTO profile_id 
  FROM public.profiles 
  WHERE user_id = student_uuid;
  
  IF profile_id IS NULL THEN
    RETURN json_build_object('error', 'Profile not found for student');
  END IF;
  
  -- Delete existing profile skills
  DELETE FROM public.profile_skills WHERE profile_id = profile_id;
  
  -- Process each skill
  FOREACH skill_name IN ARRAY skills_data
  LOOP
    -- Ensure skill exists in skills table
    INSERT INTO public.skills (name) 
    VALUES (skill_name) 
    ON CONFLICT (name) DO NOTHING;
    
    -- Get skill ID
    SELECT id INTO skill_id FROM public.skills WHERE name = skill_name;
    
    -- Link skill to profile
    INSERT INTO public.profile_skills (profile_id, skill_id, level)
    VALUES (profile_id, skill_id, 50);
  END LOOP;
  
  RETURN json_build_object('success', true);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', 'Failed to update skills: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle student experiences
CREATE OR REPLACE FUNCTION public.update_student_experiences(
  student_uuid UUID,
  experience_data JSON
)
RETURNS JSON AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Get profile ID for the student
  SELECT id INTO profile_id 
  FROM public.profiles 
  WHERE user_id = student_uuid;
  
  IF profile_id IS NULL THEN
    RETURN json_build_object('error', 'Profile not found for student');
  END IF;
  
  -- Delete existing experiences
  DELETE FROM public.experiences WHERE profile_id = profile_id;
  
  -- Insert new experience if provided
  IF experience_data->>'description' IS NOT NULL AND experience_data->>'description' != '' THEN
    INSERT INTO public.experiences (profile_id, title, description)
    VALUES (
      profile_id,
      experience_data->>'title',
      experience_data->>'description'
    );
  END IF;
  
  RETURN json_build_object('success', true);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', 'Failed to update experiences: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle student certifications
CREATE OR REPLACE FUNCTION public.update_student_certifications(
  student_uuid UUID,
  certifications_data TEXT[]
)
RETURNS JSON AS $$
DECLARE
  profile_id UUID;
  cert_name TEXT;
BEGIN
  -- Get profile ID for the student
  SELECT id INTO profile_id 
  FROM public.profiles 
  WHERE user_id = student_uuid;
  
  IF profile_id IS NULL THEN
    RETURN json_build_object('error', 'Profile not found for student');
  END IF;
  
  -- Delete existing certifications
  DELETE FROM public.certifications WHERE profile_id = profile_id;
  
  -- Insert new certifications
  FOREACH cert_name IN ARRAY certifications_data
  LOOP
    INSERT INTO public.certifications (profile_id, name, verified)
    VALUES (profile_id, cert_name, false);
  END LOOP;
  
  RETURN json_build_object('success', true);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', 'Failed to update certifications: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle student job preferences
CREATE OR REPLACE FUNCTION public.update_student_job_prefs(
  student_uuid UUID,
  job_prefs_data JSON
)
RETURNS JSON AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Get profile ID for the student
  SELECT id INTO profile_id 
  FROM public.profiles 
  WHERE user_id = student_uuid;
  
  IF profile_id IS NULL THEN
    RETURN json_build_object('error', 'Profile not found for student');
  END IF;
  
  -- Insert or update job preferences
  INSERT INTO public.job_prefs (profile_id, desired_roles, preferred_cities, salary_expectation, work_style)
  VALUES (
    profile_id,
    CASE 
      WHEN job_prefs_data->>'desired_roles' IS NOT NULL 
      THEN ARRAY[job_prefs_data->>'desired_roles'] 
      ELSE ARRAY[]::TEXT[] 
    END,
    CASE 
      WHEN job_prefs_data->>'preferred_cities' IS NOT NULL 
      THEN string_to_array(job_prefs_data->>'preferred_cities', ',') 
      ELSE ARRAY[]::TEXT[] 
    END,
    job_prefs_data->>'salary_expectation',
    job_prefs_data->>'work_style'
  )
  ON CONFLICT (profile_id) 
  DO UPDATE SET
    desired_roles = EXCLUDED.desired_roles,
    preferred_cities = EXCLUDED.preferred_cities,
    salary_expectation = EXCLUDED.salary_expectation,
    work_style = EXCLUDED.work_style;
  
  RETURN json_build_object('success', true);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', 'Failed to update job preferences: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
