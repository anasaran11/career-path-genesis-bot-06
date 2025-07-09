
import { supabase } from '@/integrations/supabase/client';

export interface CareerRecommendation {
  id: string;
  title: string;
  match_score: number;
  salary_range: string;
  growth: string;
  description: string;
  skill_gaps: string[];
}

export interface SkillGap {
  id: string;
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

export interface Course {
  id: string;
  title: string;
  summary?: string;
  duration?: string;
  key_skills?: string[];
  price?: number;
  level?: string;
  course_id?: string;
  provider?: string;
}

// Type for the consume_credit function response
interface CreditResponse {
  success?: boolean;
  remaining_credits?: number;
  error?: string;
}

export const getAnalysisData = async (userId: string) => {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Get career recommendations
    const { data: careerRecsData } = await supabase
      .from('career_recs')
      .select('*')
      .eq('profile_id', profile.id)
      .order('match_score', { ascending: false });

    // Transform career recommendations to match the interface
    const careerRecs: CareerRecommendation[] = (careerRecsData || []).map(rec => ({
      id: rec.id,
      title: rec.title || '',
      match_score: rec.match_score || 0,
      salary_range: rec.salary_range || '',
      growth: rec.growth || '',
      description: rec.description || '',
      skill_gaps: [] // Will be populated from skill_gaps table or analysis
    }));

    // Get skill gaps
    const { data: skillGaps } = await supabase
      .from('skill_gaps')
      .select('*')
      .eq('profile_id', profile.id);

    // Get advisory report
    const { data: advisoryData } = await supabase
      .from('advisory_reports')
      .select('*')
      .eq('profile_id', profile.id)
      .single();

    let advisoryReport = null;
    if (advisoryData?.report_text) {
      try {
        advisoryReport = JSON.parse(advisoryData.report_text);
      } catch (error) {
        console.error('Failed to parse advisory report:', error);
      }
    }

    return {
      profile,
      careerRecs,
      skillGaps: skillGaps || [],
      advisoryReport
    };
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    throw error;
  }
};

export const getZaneCourses = async (): Promise<Course[]> => {
  try {
    const { data: courses, error } = await supabase
      .from('zane_courses')
      .select('*')
      .eq('active', true)
      .order('title');

    if (error) {
      console.error('Error fetching Zane courses:', error);
      return [];
    }

    return courses || [];
  } catch (error) {
    console.error('Error fetching Zane courses:', error);
    return [];
  }
};

export const consumeCredit = async (profileId: string): Promise<CreditResponse> => {
  try {
    const { data, error } = await supabase
      .rpc('consume_credit', { user_profile_id: profileId });

    if (error) {
      throw new Error(error.message);
    }

    // Type assertion since we know the structure of our function response
    return data as CreditResponse;
  } catch (error) {
    console.error('Error consuming credit:', error);
    throw error;
  }
};

export const getUserCredits = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return profile?.credits || 0;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
  }
};
