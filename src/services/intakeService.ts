import { supabase } from "@/integrations/supabase/client";

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

export const submitIntakeData = async (
  formData: IntakeFormData,
  studentId: string,
) => {
  try {
    console.log("Starting intake data submission for student:", studentId);

    // Create profile using service function that bypasses RLS
    const profileData = {
      name: formData.fullName,
      email: formData.email,
      mobile: formData.phone,
      city: formData.location,
    };

    const { data: profileResult, error: profileError } = await supabase.rpc(
      "create_or_update_student_profile",
      {
        student_uuid: studentId,
        profile_data: profileData,
      },
    );

    if (profileError) {
      console.error("Profile RPC error:", profileError);
      throw new Error(`Profile error: ${profileError.message}`);
    }

    if (profileResult.error) {
      console.error("Profile error:", profileResult.error);
      throw new Error(`Profile error: ${profileResult.error}`);
    }

    const profileId = profileResult.profile_id;
    console.log("Profile handled successfully:", profileId);

    // Insert education data using service function
    const educationEntries = [];

    if (formData.ugDegree) {
      educationEntries.push({
        degree: formData.ugDegree,
        institution: formData.ugSpecialization,
        end_year: formData.ugYear || "",
      });
    }

    if (formData.pgDegree) {
      educationEntries.push({
        degree: formData.pgDegree,
        institution: formData.pgSpecialization,
        end_year: formData.pgYear || "",
      });
    }

    if (educationEntries.length > 0) {
      const { data: educationResult, error: educationError } =
        await supabase.rpc("update_student_education", {
          student_uuid: studentId,
          education_data: educationEntries,
        });

      if (educationError || educationResult?.error) {
        console.error(
          "Education update error:",
          educationError || educationResult.error,
        );
      } else {
        console.log("Education data updated successfully");
      }
    }

    // Handle skills using service function
    if (formData.technicalSkills || formData.softSkills) {
      const allSkills = [];

      if (formData.technicalSkills) {
        const techSkills = formData.technicalSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        allSkills.push(...techSkills);
      }

      if (formData.softSkills) {
        const softSkills = formData.softSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        allSkills.push(...softSkills);
      }

      if (allSkills.length > 0) {
        const { data: skillsResult, error: skillsError } = await supabase.rpc(
          "update_student_skills",
          {
            student_uuid: studentId,
            skills_data: allSkills,
          },
        );

        if (skillsError || skillsResult?.error) {
          console.error(
            "Skills update error:",
            skillsError || skillsResult.error,
          );
        } else {
          console.log("Skills updated successfully");
        }
      }
    }

    // Insert experience data using service function
    if (formData.internships) {
      const experienceData = {
        title: "Internship Experience",
        description: formData.internships,
      };

      const { data: experienceResult, error: experienceError } =
        await supabase.rpc("update_student_experiences", {
          student_uuid: studentId,
          experience_data: experienceData,
        });

      if (experienceError || experienceResult?.error) {
        console.error(
          "Experience update error:",
          experienceError || experienceResult.error,
        );
      } else {
        console.log("Experience updated successfully");
      }
    }

    // Insert certifications using service function
    if (formData.certifications) {
      const certList = formData.certifications
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);

      if (certList.length > 0) {
        const { data: certResult, error: certError } = await supabase.rpc(
          "update_student_certifications",
          {
            student_uuid: studentId,
            certifications_data: certList,
          },
        );

        if (certError || certResult?.error) {
          console.error(
            "Certifications update error:",
            certError || certResult.error,
          );
        } else {
          console.log("Certifications updated successfully");
        }
      }
    }

    // Insert job preferences using service function
    const jobPrefData = {
      desired_roles: formData.preferredIndustry,
      preferred_cities: formData.jobLocations,
      salary_expectation: formData.salaryExpectation,
      work_style: formData.workStyle,
    };

    const { data: jobPrefResult, error: jobPrefError } = await supabase.rpc(
      "update_student_job_prefs",
      {
        student_uuid: studentId,
        job_prefs_data: jobPrefData,
      },
    );

    if (jobPrefError || jobPrefResult?.error) {
      console.error(
        "Job preferences error:",
        jobPrefError || jobPrefResult.error,
      );
    } else {
      console.log("Job preferences saved successfully");
    }

    console.log("Intake data submission completed successfully");
    return { success: true, profileId: profileId };
  } catch (error) {
    console.error("Error submitting intake data:", error);
    return { success: false, error: error.message };
  }
};
