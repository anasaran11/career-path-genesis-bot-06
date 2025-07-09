
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

export const submitIntakeData = async (formData: IntakeFormData, studentId: string) => {
  try {
    console.log('Starting intake data submission for student:', studentId);
    
    // Create a UUID from the student ID for profiles table
    // Since we're using custom auth, we'll create profiles using the student ID
    const profileData = {
      user_id: studentId,
      name: formData.fullName,
      email: formData.email,
      mobile: formData.phone,
      city: formData.location,
      updated_at: new Date().toISOString()
    };

    // Insert or update profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`Profile error: ${profileError.message}`);
    }

    console.log('Profile handled successfully:', profile?.id);

    // Insert education data
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
      // Delete existing education records for this profile
      await supabase
        .from('educations')
        .delete()
        .eq('profile_id', profile.id);

      const { error: educationError } = await supabase
        .from('educations')
        .insert(educationEntries);
      
      if (educationError) {
        console.error('Education insert error:', educationError);
      } else {
        console.log('Education data inserted successfully');
      }
    }

    // Handle skills
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

      if (allSkills.length > 0) {
        // First, ensure all skills exist in the skills table
        for (const skillName of allSkills) {
          await supabase
            .from('skills')
            .upsert({ name: skillName }, { onConflict: 'name' });
        }

        // Get skill IDs
        const { data: existingSkills } = await supabase
          .from('skills')
          .select('*')
          .in('name', allSkills);

        if (existingSkills) {
          // Delete existing profile skills
          await supabase
            .from('profile_skills')
            .delete()
            .eq('profile_id', profile.id);

          // Insert new profile skills
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
    }

    // Insert experience data (internships)
    if (formData.internships) {
      // Delete existing experiences
      await supabase
        .from('experiences')
        .delete()
        .eq('profile_id', profile.id);

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

    // Insert certifications
    if (formData.certifications) {
      const certList = formData.certifications.split(',').map(c => c.trim()).filter(c => c);
      
      if (certList.length > 0) {
        // Delete existing certifications
        await supabase
          .from('certifications')
          .delete()
          .eq('profile_id', profile.id);

        const certEntries = certList.map(cert => ({
          profile_id: profile.id,
          name: cert,
          verified: false // Unverified until manual review
        }));

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

    // Insert job preferences
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
