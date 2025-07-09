import { supabase } from "@/integrations/supabase/client";
import { IntakeFormData } from "./intakeService";

export interface CareerRecommendation {
  title: string;
  match_score: number;
  salary_range: string;
  growth: string;
  skill_gaps: string[];
  description: string;
}

export interface SkillGap {
  missing_skill: string;
  importance: string;
}

export interface AdvisoryReport {
  career_fit: {
    score: number;
    next_actions: string[];
  };
  learning_priorities: Array<{
    title: string;
    priority: string;
    timeframe: string;
    next_action: string;
  }>;
  path_strategy: Array<{
    title: string;
    priority: string;
    timeframe: string;
    next_action: string;
  }>;
}

export interface StudentProfile {
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  ug_degree: string;
  ug_specialization: string;
  ug_year: string;
  pg_degree: string;
  pg_specialization: string;
  pg_year: string;
  technical_skills: string;
  soft_skills: string;
  internships: string;
  projects: string;
  certifications: string;
  preferred_industry: string;
  career_goals: string;
  job_locations: string;
  salary_expectation: string;
  work_style: string;
}

// Get student profile data from localStorage or database
export const getStudentProfileData = async (
  studentId: string,
): Promise<StudentProfile | null> => {
  try {
    // First try to get from localStorage (fallback from intake)
    const localData = localStorage.getItem(`student_profile_${studentId}`);
    if (localData) {
      console.log("Found student profile in localStorage");
      return JSON.parse(localData);
    }

    // Try to get from database if profiles exist
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        `
        *,
        educations(*),
        profile_skills(*, skills(*)),
        experiences(*),
        certifications(*),
        job_prefs(*)
      `,
      )
      .eq("user_id", studentId)
      .single();

    if (profile) {
      console.log("Found student profile in database");
      // Convert database profile to student profile format
      return convertDatabaseProfileToStudentProfile(profile, studentId);
    }

    return null;
  } catch (error) {
    console.error("Error getting student profile data:", error);
    return null;
  }
};

const convertDatabaseProfileToStudentProfile = (
  dbProfile: any,
  studentId: string,
): StudentProfile => {
  const educations = dbProfile.educations || [];
  const skills = dbProfile.profile_skills || [];
  const experiences = dbProfile.experiences || [];
  const certifications = dbProfile.certifications || [];
  const jobPrefs = dbProfile.job_prefs;

  const ugEducation = educations.find(
    (e: any) =>
      e.degree?.toLowerCase().includes("b.") ||
      e.degree?.toLowerCase().includes("bachelor") ||
      e.degree?.toLowerCase().includes("bpharm") ||
      e.degree?.toLowerCase().includes("bsc"),
  );

  const pgEducation = educations.find(
    (e: any) =>
      e.degree?.toLowerCase().includes("m.") ||
      e.degree?.toLowerCase().includes("master") ||
      e.degree?.toLowerCase().includes("mpharm") ||
      e.degree?.toLowerCase().includes("msc") ||
      e.degree?.toLowerCase().includes("pharm.d"),
  );

  const technicalSkills = skills
    .filter((ps: any) => ps.skills?.name && isTechnicalSkill(ps.skills.name))
    .map((ps: any) => ps.skills.name)
    .join(", ");

  const softSkills = skills
    .filter((ps: any) => ps.skills?.name && !isTechnicalSkill(ps.skills.name))
    .map((ps: any) => ps.skills.name)
    .join(", ");

  return {
    student_id: studentId,
    full_name: dbProfile.name || "",
    email: dbProfile.email || "",
    phone: dbProfile.mobile || "",
    location: dbProfile.city || "",
    ug_degree: ugEducation?.degree || "",
    ug_specialization: ugEducation?.institution || "",
    ug_year: ugEducation?.end_year?.toString() || "",
    pg_degree: pgEducation?.degree || "",
    pg_specialization: pgEducation?.institution || "",
    pg_year: pgEducation?.end_year?.toString() || "",
    technical_skills: technicalSkills,
    soft_skills: softSkills,
    internships: experiences.map((e: any) => e.description).join("; ") || "",
    projects: "", // Not stored separately in current schema
    certifications: certifications.map((c: any) => c.name).join(", ") || "",
    preferred_industry: jobPrefs?.desired_roles?.[0] || "",
    career_goals: "", // Not stored in current schema
    job_locations: jobPrefs?.preferred_cities?.join(", ") || "",
    salary_expectation: jobPrefs?.salary_expectation || "",
    work_style: jobPrefs?.work_style || "",
  };
};

const isTechnicalSkill = (skillName: string): boolean => {
  const technicalKeywords = [
    "clinical",
    "gcp",
    "medical",
    "pharmacovigilance",
    "regulatory",
    "data",
    "statistical",
    "laboratory",
    "technology",
    "software",
    "research",
    "analysis",
    "development",
    "quality",
    "technical",
  ];

  return technicalKeywords.some((keyword) =>
    skillName.toLowerCase().includes(keyword),
  );
};

// Main analysis function that works with student data
export const analyzeStudentProfile = async (
  studentId: string,
): Promise<{
  career_recs: CareerRecommendation[];
  skill_gaps: string[];
  advisory_report: AdvisoryReport;
}> => {
  try {
    console.log("Starting student profile analysis for:", studentId);

    // Get student profile data
    let profileData = await getStudentProfileData(studentId);
    if (!profileData) {
      console.log("No profile data found, creating demo profile for testing");
      // Import and create demo data for testing
      const { createDemoProfile } = await import("./demoDataService");
      profileData = createDemoProfile(studentId);
    }

    console.log("Analyzing profile data:", profileData);

    // Generate career recommendations
    const careerRecs = generateStudentCareerRecommendations(profileData);
    console.log("Generated career recommendations:", careerRecs);

    // Identify skill gaps
    const skillGaps = identifyStudentSkillGaps(profileData);
    console.log("Identified skill gaps:", skillGaps);

    // Generate advisory report
    const advisoryReport = generateStudentAdvisoryReport(
      profileData,
      skillGaps,
    );
    console.log("Generated advisory report:", advisoryReport);

    // Store results for future reference - with improved error handling
    try {
      const storeSuccess = await storeAnalysisResults(
        studentId,
        careerRecs,
        skillGaps,
        advisoryReport,
      );
      if (!storeSuccess) {
        console.log(
          "Database storage not available, using localStorage backup",
        );
      }
    } catch (storeError) {
      console.warn("Could not store analysis results in database:", storeError);
    }

    // Always store in localStorage as backup/primary storage
    localStorage.setItem(
      `analysis_${studentId}`,
      JSON.stringify({
        career_recs: careerRecs,
        skill_gaps: skillGaps,
        advisory_report: advisoryReport,
        analyzed_at: new Date().toISOString(),
      }),
    );

    return {
      career_recs: careerRecs,
      skill_gaps: skillGaps,
      advisory_report: advisoryReport,
    };
  } catch (error) {
    console.error("Error analyzing student profile:", error);
    throw error;
  }
};

const generateStudentCareerRecommendations = (
  profile: StudentProfile,
): CareerRecommendation[] => {
  const healthcareRoles = [
    {
      title: "Clinical Research Associate",
      base_score: 75,
      skills_needed: ["GCP Training", "Clinical Research", "Medical Writing"],
      salary: "$65,000 - $85,000",
      growth: "Medium",
    },
    {
      title: "Pharmacovigilance Specialist",
      base_score: 80,
      skills_needed: ["Pharmacovigilance", "Drug Safety", "Regulatory Affairs"],
      salary: "$70,000 - $95,000",
      growth: "Medium",
    },
    {
      title: "Medical Science Liaison",
      base_score: 85,
      skills_needed: [
        "Medical Writing",
        "Clinical Research",
        "Patient Communication",
      ],
      salary: "$120,000 - $160,000",
      growth: "High",
    },
    {
      title: "Regulatory Affairs Manager",
      base_score: 78,
      skills_needed: [
        "Regulatory Affairs",
        "Drug Development",
        "Quality Assurance",
      ],
      salary: "$95,000 - $130,000",
      growth: "High",
    },
    {
      title: "Clinical Data Manager",
      base_score: 82,
      skills_needed: [
        "Clinical Data Management",
        "Statistical Analysis",
        "Healthcare Technology",
      ],
      salary: "$75,000 - $105,000",
      growth: "Medium",
    },
    {
      title: "Medical Writer",
      base_score: 88,
      skills_needed: [
        "Medical Writing",
        "Scientific Communication",
        "Regulatory Documents",
      ],
      salary: "$80,000 - $120,000",
      growth: "Medium",
    },
    {
      title: "Quality Assurance Specialist",
      base_score: 70,
      skills_needed: [
        "Quality Assurance",
        "GCP Training",
        "Laboratory Techniques",
      ],
      salary: "$60,000 - $80,000",
      growth: "Medium",
    },
    {
      title: "Project Manager - Healthcare",
      base_score: 76,
      skills_needed: [
        "Project Management",
        "Team Leadership",
        "Healthcare Technology",
      ],
      salary: "$85,000 - $115,000",
      growth: "Medium",
    },
    {
      title: "Clinical Trial Manager",
      base_score: 84,
      skills_needed: [
        "Clinical Research",
        "Project Management",
        "GCP Training",
      ],
      salary: "$90,000 - $125,000",
      growth: "High",
    },
    {
      title: "Drug Safety Associate",
      base_score: 79,
      skills_needed: ["Pharmacovigilance", "Drug Safety", "Medical Writing"],
      salary: "$65,000 - $90,000",
      growth: "Medium",
    },
    {
      title: "Biostatistician",
      base_score: 86,
      skills_needed: [
        "Statistical Analysis",
        "Clinical Data Management",
        "Healthcare Technology",
      ],
      salary: "$85,000 - $125,000",
      growth: "High",
    },
    {
      title: "Medical Affairs Specialist",
      base_score: 81,
      skills_needed: [
        "Medical Writing",
        "Clinical Research",
        "Regulatory Affairs",
      ],
      salary: "$90,000 - $120,000",
      growth: "Medium",
    },
  ];

  const allSkillsText =
    `${profile.technical_skills} ${profile.soft_skills}`.toLowerCase();

  return healthcareRoles
    .map((role) => {
      let matchScore = role.base_score;
      const skillGaps: string[] = [];

      // Calculate match based on skills
      for (const requiredSkill of role.skills_needed) {
        if (allSkillsText.includes(requiredSkill.toLowerCase())) {
          matchScore += 5;
        } else {
          matchScore -= 10;
          skillGaps.push(requiredSkill);
        }
      }

      // Education bonus
      if (profile.pg_degree) {
        if (
          profile.pg_degree.toLowerCase().includes("master") ||
          profile.pg_degree.toLowerCase().includes("mpharm")
        ) {
          matchScore += 8;
        }
        if (
          profile.pg_degree.toLowerCase().includes("phd") ||
          profile.pg_degree.toLowerCase().includes("pharm.d")
        ) {
          matchScore += 12;
        }
      }

      // Experience bonus
      if (profile.internships) {
        matchScore += 10;
      }

      // Preferred industry alignment
      if (
        profile.preferred_industry &&
        role.title
          .toLowerCase()
          .includes(profile.preferred_industry.toLowerCase())
      ) {
        matchScore += 15;
      }

      return {
        title: role.title,
        match_score: Math.max(30, Math.min(95, matchScore)),
        salary_range: role.salary,
        growth: role.growth,
        skill_gaps: skillGaps,
        description: `${role.title} position in the healthcare/pharmaceutical sector with ${role.growth.toLowerCase()} growth potential`,
      };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 6);
};

const identifyStudentSkillGaps = (profile: StudentProfile): string[] => {
  const allSkillsText =
    `${profile.technical_skills} ${profile.soft_skills}`.toLowerCase();

  const criticalSkills = [
    "GCP Training",
    "Clinical Research",
    "Pharmacovigilance",
    "Medical Writing",
    "Regulatory Affairs",
    "Statistical Analysis",
    "Project Management",
    "Healthcare Technology",
    "Quality Assurance",
  ];

  return criticalSkills
    .filter((skill) => !allSkillsText.includes(skill.toLowerCase()))
    .slice(0, 4);
};

const generateStudentAdvisoryReport = (
  profile: StudentProfile,
  skillGaps: string[],
): AdvisoryReport => {
  const hasExperience = profile.internships?.length > 0;
  const educationLevel = getStudentEducationLevel(profile);
  const baseScore = hasExperience ? 78 : 65;
  const educationBonus =
    educationLevel === "masters" ? 10 : educationLevel === "doctorate" ? 15 : 0;

  return {
    career_fit: {
      score: Math.min(95, baseScore + educationBonus),
      next_actions: [
        skillGaps.length > 0
          ? "Complete skill development in identified gap areas"
          : "Apply for entry-level positions in healthcare",
        "Build professional network in pharmaceutical industry",
        "Consider specialized certifications in chosen field",
        "Update LinkedIn profile with new skills and certifications",
      ],
    },
    learning_priorities: [
      {
        title: skillGaps[0] || "Advanced Clinical Research Methods",
        priority: "High",
        timeframe: "2-3 months",
        next_action:
          "Enroll in comprehensive training program or online certification",
      },
      {
        title: "Industry Networking & Professional Development",
        priority: "Medium",
        timeframe: "3-6 months",
        next_action: "Join professional associations like ACRP, DIA, or ISPE",
      },
      {
        title: skillGaps[1] || "Regulatory Documentation Skills",
        priority: "High",
        timeframe: "1-2 months",
        next_action: "Complete FDA/ICH guidelines certification course",
      },
    ],
    path_strategy: [
      {
        title: "Entry-Level Position Targeting",
        priority: "High",
        timeframe: "1-3 months",
        next_action:
          "Apply for 5-10 relevant positions weekly on LinkedIn and company websites",
      },
      {
        title: "Professional Certification Achievement",
        priority: "Medium",
        timeframe: "6-12 months",
        next_action:
          "Research and enroll in industry-recognized certification programs (ACRP, SOCRA)",
      },
      {
        title: "Senior Role Preparation",
        priority: "Medium",
        timeframe: "12-24 months",
        next_action:
          "Gain 2+ years experience and develop leadership skills for management roles",
      },
    ],
  };
};

const getStudentEducationLevel = (profile: StudentProfile): string => {
  if (
    profile.pg_degree?.toLowerCase().includes("phd") ||
    profile.pg_degree?.toLowerCase().includes("doctorate")
  ) {
    return "doctorate";
  }
  if (
    profile.pg_degree?.toLowerCase().includes("master") ||
    profile.pg_degree?.toLowerCase().includes("mpharm")
  ) {
    return "masters";
  }
  return "bachelors";
};

const storeAnalysisResults = async (
  studentId: string,
  careerRecs: CareerRecommendation[],
  skillGaps: string[],
  advisoryReport: AdvisoryReport,
): Promise<boolean> => {
  try {
    // Try to get profile ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", studentId)
      .single();

    if (profileError || !profile) {
      console.warn(
        "Profile not found in database for storing analysis results. Student ID:",
        studentId,
        "Error:",
        profileError,
      );
      // Return false instead of throwing error
      return false;
    }

    // Store career recommendations
    if (careerRecs.length > 0) {
      const recsToInsert = careerRecs.map((rec) => ({
        profile_id: profile.id,
        title: rec.title,
        match_score: rec.match_score,
        salary_range: rec.salary_range,
        growth: rec.growth,
        description: rec.description,
      }));

      await supabase.from("career_recs").delete().eq("profile_id", profile.id);
      await supabase.from("career_recs").insert(recsToInsert);
    }

    // Store skill gaps
    if (skillGaps.length > 0) {
      const gapsToInsert = skillGaps.map((gap) => ({
        profile_id: profile.id,
        missing_skill: gap,
        importance: "High",
      }));

      await supabase.from("skill_gaps").delete().eq("profile_id", profile.id);
      await supabase.from("skill_gaps").insert(gapsToInsert);
    }

    // Store advisory report
    await supabase.from("advisory_reports").upsert(
      {
        profile_id: profile.id,
        report_text: JSON.stringify(advisoryReport),
        report_type: "career_roadmap",
      },
      { onConflict: "profile_id" },
    );

    console.log("Analysis results stored successfully in database");
    return true;
  } catch (error) {
    console.error("Error storing analysis results:", error);
    return false;
  }
};

// Get cached analysis results
export const getCachedAnalysisResults = async (studentId: string) => {
  try {
    // Try localStorage first
    const localData = localStorage.getItem(`analysis_${studentId}`);
    if (localData) {
      const parsed = JSON.parse(localData);
      const hoursSinceAnalysis =
        (Date.now() - new Date(parsed.analyzed_at).getTime()) /
        (1000 * 60 * 60);

      // Return cached results if less than 24 hours old
      if (hoursSinceAnalysis < 24) {
        return parsed;
      }
    }

    // Try database
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        `
        id,
        career_recs(*),
        skill_gaps(*),
        advisory_reports(*)
      `,
      )
      .eq("user_id", studentId)
      .single();

    if (
      profile &&
      (profile.career_recs?.length > 0 || profile.skill_gaps?.length > 0)
    ) {
      let advisoryReport = null;
      if (profile.advisory_reports?.[0]?.report_text) {
        try {
          advisoryReport = JSON.parse(profile.advisory_reports[0].report_text);
        } catch (e) {
          console.error("Error parsing advisory report:", e);
        }
      }

      return {
        career_recs: profile.career_recs || [],
        skill_gaps:
          profile.skill_gaps?.map((sg: any) => sg.missing_skill) || [],
        advisory_report: advisoryReport,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting cached analysis results:", error);
    return null;
  }
};
