
import { supabase } from '@/integrations/supabase/client';

export interface IntakeFormData {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  location: string;
  
  // Education Background
  ugDegree: string;
  ugSpecialization: string;
  ugYear: string;
  pgDegree: string;
  pgSpecialization: string;
  pgYear: string;
  
  // Skills & Experience
  technicalSkills: string;
  softSkills: string;
  internships: string;
  projects: string;
  certifications: string;
  
  // Career Goals
  preferredIndustry: string;
  careerGoals: string;
  jobLocations: string;
  salaryExpectation: string;
  workStyle: string;
}

export const submitIntakeData = async (formData: IntakeFormData, userId: string) => {
  try {
    console.log('Starting intake data submission for user:', userId);
    
    // 1. Get or create user profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error(`Profile error: ${profileError.message}`);
    }

    // Update profile with intake data
    const profileData = {
      name: formData.fullName,
      email: formData.email,
      mobile: formData.phone,
      city: formData.location,
      updated_at: new Date().toISOString()
    };

    if (profile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId);
      
      if (updateError) throw new Error(`Profile update error: ${updateError.message}`);
    } else {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ ...profileData, user_id: userId })
        .select()
        .single();
      
      if (insertError) throw new Error(`Profile insert error: ${insertError.message}`);
      profile = newProfile;
    }

    console.log('Profile handled successfully:', profile?.id);

    // 2. Insert education data
    const educationEntries = [];
    
    if (formData.ugDegree) {
      educationEntries.push({
        profile_id: profile.id,
        degree: formData.ugDegree,
        institution: formData.ugSpecialization,
        end_year: formData.ugYear ? parseInt(formData.ugYear) : null
      });
    }
    
    if (formData.pgDegree) {
      educationEntries.push({
        profile_id: profile.id,
        degree: formData.pgDegree,
        institution: formData.pgSpecialization,
        end_year: formData.pgYear ? parseInt(formData.pgYear) : null
      });
    }

    if (educationEntries.length > 0) {
      const { error: educationError } = await supabase
        .from('educations')
        .insert(educationEntries);
      
      if (educationError) {
        console.error('Education insert error:', educationError);
      } else {
        console.log('Education data inserted successfully');
      }
    }

    // 3. Handle skills
    if (formData.technicalSkills || formData.softSkills) {
      const allSkills = [];
      
      if (formData.technicalSkills) {
        const techSkills = formData.technicalSkills.split(',').map(s => s.trim()).filter(s => s);
        allSkills.push(...techSkills);
      }
      
      if (formData.softSkills) {
        const softSkills = formData.softSkills.split(',').map(s => s.trim()).filter(s => s);
        allSkills.push(...softSkills);
      }

      // Insert skills that don't exist
      for (const skillName of allSkills) {
        const { error: skillError } = await supabase
          .from('skills')
          .insert({ name: skillName })
          .select();
        
        if (skillError && !skillError.message.includes('duplicate')) {
          console.error('Skill insert error:', skillError);
        }
      }

      // Link skills to profile
      const { data: existingSkills } = await supabase
        .from('skills')
        .select('*')
        .in('name', allSkills);

      if (existingSkills) {
        const profileSkills = existingSkills.map(skill => ({
          profile_id: profile.id,
          skill_id: skill.id,
          level: 50 // Default level
        }));

        const { error: profileSkillsError } = await supabase
          .from('profile_skills')
          .insert(profileSkills);
        
        if (profileSkillsError) {
          console.error('Profile skills error:', profileSkillsError);
        } else {
          console.log('Skills linked to profile successfully');
        }
      }
    }

    // 4. Insert experience data
    if (formData.internships) {
      const { error: experienceError } = await supabase
        .from('experiences')
        .insert({
          profile_id: profile.id,
          title: 'Internship Experience',
          description: formData.internships
        });
      
      if (experienceError) {
        console.error('Experience insert error:', experienceError);
      }
    }

    // 5. Insert certifications
    if (formData.certifications) {
      const certList = formData.certifications.split(',').map(c => c.trim()).filter(c => c);
      const certEntries = certList.map(cert => ({
        profile_id: profile.id,
        name: cert
      }));

      if (certEntries.length > 0) {
        const { error: certError } = await supabase
          .from('certifications')
          .insert(certEntries);
        
        if (certError) {
          console.error('Certifications insert error:', certError);
        } else {
          console.log('Certifications inserted successfully');
        }
      }
    }

    // 6. Insert job preferences
    const jobPrefData = {
      profile_id: profile.id,
      desired_roles: formData.preferredIndustry ? [formData.preferredIndustry] : [],
      preferred_cities: formData.jobLocations ? formData.jobLocations.split(',').map(c => c.trim()) : [],
      salary_expectation: formData.salaryExpectation,
      work_style: formData.workStyle
    };

    const { error: jobPrefError } = await supabase
      .from('job_prefs')
      .upsert(jobPrefData, { onConflict: 'profile_id' });
    
    if (jobPrefError) {
      console.error('Job preferences error:', jobPrefError);
    } else {
      console.log('Job preferences saved successfully');
    }

    console.log('Intake data submission completed successfully');
    return { success: true, profileId: profile.id };

  } catch (error) {
    console.error('Error submitting intake data:', error);
    return { success: false, error: error.message };
  }
};
