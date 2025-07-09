// Demo data service to ensure the application works even without full database connectivity

export const createDemoProfile = (studentId: string) => {
  const demoProfile = {
    student_id: studentId,
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    location: "Bangalore, Karnataka",
    ug_degree: "B.Pharm",
    ug_specialization: "Clinical Pharmacy",
    ug_year: "2023",
    pg_degree: "M.Pharm",
    pg_specialization: "Pharmacology",
    pg_year: "2025",
    technical_skills:
      "Clinical Research, GCP Training, Medical Writing, Pharmacovigilance",
    soft_skills:
      "Patient Communication, Team Leadership, Problem Solving, Attention to Detail",
    internships:
      "6-month internship at Apollo Hospitals working in clinical pharmacy department, assisted in drug therapy monitoring and patient counseling",
    projects:
      "Research project on adverse drug reactions in cardiovascular medications, published case study on drug interactions",
    certifications:
      "GCP Certification, Clinical Research Certification, Pharmacovigilance Course",
    preferred_industry: "Clinical Research",
    career_goals:
      "To become a Clinical Research Associate and eventually lead clinical trials in pharmaceutical companies",
    job_locations: "Bangalore, Hyderabad, Mumbai",
    salary_expectation: "5-8",
    work_style: "Hybrid",
    created_at: new Date().toISOString(),
  };

  // Store demo profile in localStorage
  localStorage.setItem(
    `student_profile_${studentId}`,
    JSON.stringify(demoProfile),
  );

  return demoProfile;
};

export const getDemoAnalysisResults = () => {
  return {
    career_recs: [
      {
        title: "Clinical Research Associate",
        match_score: 88,
        salary_range: "$65,000 - $85,000",
        growth: "High",
        skill_gaps: ["Statistical Analysis"],
        description:
          "Clinical Research Associate position in the healthcare/pharmaceutical sector with high growth potential",
      },
      {
        title: "Pharmacovigilance Specialist",
        match_score: 85,
        salary_range: "$70,000 - $95,000",
        growth: "Medium",
        skill_gaps: ["Drug Safety", "Regulatory Affairs"],
        description:
          "Pharmacovigilance Specialist position in the healthcare/pharmaceutical sector with medium growth potential",
      },
      {
        title: "Medical Writer",
        match_score: 82,
        salary_range: "$80,000 - $120,000",
        growth: "Medium",
        skill_gaps: ["Scientific Communication"],
        description:
          "Medical Writer position in the healthcare/pharmaceutical sector with medium growth potential",
      },
      {
        title: "Clinical Data Manager",
        match_score: 78,
        salary_range: "$75,000 - $105,000",
        growth: "Medium",
        skill_gaps: ["Clinical Data Management", "Statistical Analysis"],
        description:
          "Clinical Data Manager position in the healthcare/pharmaceutical sector with medium growth potential",
      },
      {
        title: "Regulatory Affairs Manager",
        match_score: 75,
        salary_range: "$95,000 - $130,000",
        growth: "High",
        skill_gaps: ["Regulatory Affairs", "Drug Development"],
        description:
          "Regulatory Affairs Manager position in the healthcare/pharmaceutical sector with high growth potential",
      },
      {
        title: "Medical Science Liaison",
        match_score: 72,
        salary_range: "$120,000 - $160,000",
        growth: "High",
        skill_gaps: ["Patient Communication", "Scientific Communication"],
        description:
          "Medical Science Liaison position in the healthcare/pharmaceutical sector with high growth potential",
      },
    ],
    skill_gaps: ["Statistical Analysis", "Drug Safety"],
    advisory_report: {
      career_fit: {
        score: 82,
        next_actions: [
          "Complete skill development in Statistical Analysis and Drug Safety",
          "Build professional network in pharmaceutical industry",
          "Consider specialized certifications in chosen field",
          "Update LinkedIn profile with new skills and certifications",
        ],
      },
      learning_priorities: [
        {
          title: "Statistical Analysis",
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
          title: "Drug Safety",
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
    },
    analyzed_at: new Date().toISOString(),
  };
};
