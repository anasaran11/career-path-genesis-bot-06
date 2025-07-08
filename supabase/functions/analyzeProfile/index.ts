
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { profile_id } = await req.json()
    console.log('Analyzing profile:', profile_id)

    // Get full profile data
    const { data: fullProfile, error: profileError } = await supabase
      .rpc('get_full_profile', { uid: profile_id })

    if (profileError) {
      throw new Error(`Profile fetch error: ${profileError.message}`)
    }

    // Generate AI-powered career recommendations
    const careerRecs = generateCareerRecommendations(fullProfile)
    const skillGaps = identifySkillGaps(fullProfile)
    const advisoryReport = generateAdvisoryReport(fullProfile, skillGaps)

    // Store career recommendations
    if (careerRecs.length > 0) {
      const recsToInsert = careerRecs.map(rec => ({
        profile_id: fullProfile.profile.id,
        title: rec.title,
        match_score: rec.match_score,
        salary_range: rec.salary_range,
        growth: rec.growth,
        description: rec.description || `${rec.title} role in healthcare/pharmaceutical industry`
      }))

      await supabase.from('career_recs').delete().eq('profile_id', fullProfile.profile.id)
      await supabase.from('career_recs').insert(recsToInsert)
    }

    // Store skill gaps
    if (skillGaps.length > 0) {
      const gapsToInsert = skillGaps.map(gap => ({
        profile_id: fullProfile.profile.id,
        missing_skill: gap,
        importance: 'High'
      }))

      await supabase.from('skill_gaps').delete().eq('profile_id', fullProfile.profile.id)
      await supabase.from('skill_gaps').insert(gapsToInsert)
    }

    // Store advisory report
    await supabase.from('advisory_reports').upsert({
      profile_id: fullProfile.profile.id,
      report_text: JSON.stringify(advisoryReport),
      report_type: 'career_roadmap'
    }, { onConflict: 'profile_id' })

    return new Response(
      JSON.stringify({
        career_recs: careerRecs,
        skill_gaps: skillGaps,
        advisory_report: advisoryReport
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateCareerRecommendations(profile: any) {
  const skills = profile.skills || []
  const educations = profile.educations || []
  const experiences = profile.experiences || []
  
  const healthcareRoles = [
    { title: "Clinical Research Associate", base_score: 75, skills_needed: ["GCP Training", "Clinical Research", "Medical Writing"] },
    { title: "Pharmacovigilance Specialist", base_score: 80, skills_needed: ["Pharmacovigilance", "Drug Safety", "Regulatory Affairs"] },
    { title: "Medical Science Liaison", base_score: 85, skills_needed: ["Medical Writing", "Clinical Research", "Patient Communication"] },
    { title: "Regulatory Affairs Manager", base_score: 78, skills_needed: ["Regulatory Affairs", "Drug Development", "Quality Assurance"] },
    { title: "Clinical Data Manager", base_score: 82, skills_needed: ["Clinical Data Management", "Statistical Analysis", "Healthcare Technology"] },
    { title: "Medical Writer", base_score: 88, skills_needed: ["Medical Writing", "Scientific Communication", "Regulatory Documents"] },
    { title: "Quality Assurance Specialist", base_score: 70, skills_needed: ["Quality Assurance", "GCP Training", "Laboratory Techniques"] },
    { title: "Project Manager - Healthcare", base_score: 76, skills_needed: ["Project Management", "Team Leadership", "Healthcare Technology"] },
    { title: "Clinical Trial Manager", base_score: 84, skills_needed: ["Clinical Research", "Project Management", "GCP Training"] },
    { title: "Drug Safety Associate", base_score: 79, skills_needed: ["Pharmacovigilance", "Drug Safety", "Medical Writing"] },
    { title: "Biostatistician", base_score: 86, skills_needed: ["Statistical Analysis", "Clinical Data Management", "Healthcare Technology"] },
    { title: "Medical Affairs Specialist", base_score: 81, skills_needed: ["Medical Writing", "Clinical Research", "Regulatory Affairs"] }
  ]

  const userSkillNames = skills.map((s: any) => s.name.toLowerCase())
  
  return healthcareRoles.map(role => {
    let matchScore = role.base_score
    const skillGaps = []
    
    // Calculate match based on skills
    for (const requiredSkill of role.skills_needed) {
      if (userSkillNames.some(userSkill => userSkill.includes(requiredSkill.toLowerCase()))) {
        matchScore += 5
      } else {
        matchScore -= 10
        skillGaps.push(requiredSkill)
      }
    }

    // Education bonus
    if (educations.some((e: any) => e.degree?.toLowerCase().includes('master'))) {
      matchScore += 8
    }
    if (educations.some((e: any) => e.degree?.toLowerCase().includes('phd') || e.degree?.toLowerCase().includes('doctorate'))) {
      matchScore += 12
    }

    // Experience bonus
    if (experiences.length > 0) {
      matchScore += Math.min(experiences.length * 3, 15)
    }

    return {
      title: role.title,
      match_score: Math.max(30, Math.min(95, matchScore)),
      salary_range: getSalaryRange(role.title),
      growth: getGrowthPotential(role.title),
      skill_gaps: skillGaps,
      description: `${role.title} position in the healthcare/pharmaceutical sector`
    }
  }).sort((a, b) => b.match_score - a.match_score).slice(0, 12)
}

function identifySkillGaps(profile: any) {
  const skills = profile.skills || []
  const userSkillNames = skills.map((s: any) => s.name.toLowerCase())
  
  const criticalSkills = [
    "GCP Training", "Clinical Research", "Pharmacovigilance", 
    "Medical Writing", "Regulatory Affairs", "Statistical Analysis"
  ]
  
  return criticalSkills.filter(skill => 
    !userSkillNames.some(userSkill => userSkill.includes(skill.toLowerCase()))
  ).slice(0, 3)
}

function generateAdvisoryReport(profile: any, skillGaps: string[]) {
  const hasExperience = (profile.experiences || []).length > 0
  const educationLevel = getEducationLevel(profile.educations || [])
  
  return {
    career_fit: {
      score: hasExperience ? 78 : 65,
      next_actions: [
        skillGaps.length > 0 ? "Complete skill development in identified gap areas" : "Apply for entry-level positions in healthcare",
        "Build professional network in pharmaceutical industry",
        "Consider specialized certifications in chosen field"
      ]
    },
    learning_priorities: [
      {
        title: skillGaps[0] || "Advanced Clinical Research Methods",
        priority: "High",
        timeframe: "2-3 months",
        next_action: "Enroll in comprehensive training program"
      },
      {
        title: "Industry Networking & Professional Development",
        priority: "Medium", 
        timeframe: "3-6 months",
        next_action: "Join professional associations and attend conferences"
      },
      {
        title: skillGaps[1] || "Regulatory Documentation Skills",
        priority: "High",
        timeframe: "1-2 months", 
        next_action: "Complete certification course"
      }
    ],
    path_strategy: [
      {
        title: "Entry-Level Position Targeting",
        priority: "High",
        timeframe: "1-3 months",
        next_action: "Apply for 5-10 relevant positions weekly"
      },
      {
        title: "Professional Certification Achievement", 
        priority: "Medium",
        timeframe: "6-12 months",
        next_action: "Research and enroll in industry-recognized certification programs"
      },
      {
        title: "Senior Role Preparation",
        priority: "Medium", 
        timeframe: "12-24 months",
        next_action: "Gain 2+ years experience and develop leadership skills"
      }
    ]
  }
}

function getSalaryRange(title: string) {
  const salaryMap: Record<string, string> = {
    "Clinical Research Associate": "$65,000 - $85,000",
    "Pharmacovigilance Specialist": "$70,000 - $95,000", 
    "Medical Science Liaison": "$120,000 - $160,000",
    "Regulatory Affairs Manager": "$95,000 - $130,000",
    "Clinical Data Manager": "$75,000 - $105,000",
    "Medical Writer": "$80,000 - $120,000",
    "Quality Assurance Specialist": "$60,000 - $80,000",
    "Project Manager - Healthcare": "$85,000 - $115,000",
    "Clinical Trial Manager": "$90,000 - $125,000",
    "Drug Safety Associate": "$65,000 - $90,000",
    "Biostatistician": "$85,000 - $125,000",
    "Medical Affairs Specialist": "$90,000 - $120,000"
  }
  return salaryMap[title] || "$60,000 - $100,000"
}

function getGrowthPotential(title: string) {
  const growthMap: Record<string, string> = {
    "Medical Science Liaison": "High",
    "Regulatory Affairs Manager": "High", 
    "Clinical Trial Manager": "High",
    "Biostatistician": "High",
    "Medical Writer": "Medium",
    "Clinical Data Manager": "Medium",
    "Pharmacovigilance Specialist": "Medium"
  }
  return growthMap[title] || "Medium"
}

function getEducationLevel(educations: any[]) {
  if (educations.some(e => e.degree?.toLowerCase().includes('phd') || e.degree?.toLowerCase().includes('doctorate'))) {
    return 'doctorate'
  }
  if (educations.some(e => e.degree?.toLowerCase().includes('master'))) {
    return 'masters'
  }
  return 'bachelors'
}
