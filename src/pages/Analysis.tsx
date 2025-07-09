import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  TrendingUp, 
  Target, 
  BookOpen, 
  Download, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Brain,
  FileText
} from 'lucide-react';

interface CareerRecommendation {
  title: string;
  match_score: number;
  salary_range: string;
  growth: string;
  skill_gaps: string[];
  description?: string;
}

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { student } = useStudentAuth();
  
  const [careerRecs, setCareerRecs] = useState<CareerRecommendation[]>([]);
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobScanLoading, setJobScanLoading] = useState(false);

  useEffect(() => {
    if (student) {
      loadAnalysisData();
    }
  }, [student]);

  const loadAnalysisData = async () => {
    try {
      console.log('Starting profile analysis for student:', student.id);
      
      // Call the analyzeProfile edge function
      const { data, error } = await supabase.functions.invoke('analyzeProfile', {
        body: { profile_id: student.id }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      console.log('Analysis response:', data);
      
      if (data.career_recs) {
        setCareerRecs(data.career_recs);
      }
      
      if (data.skill_gaps) {
        setSkillGaps(data.skill_gaps);
      }

    } catch (error) {
      console.error('Failed to load analysis data:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobScan = async () => {
    if (skillGaps.length > 0) {
      toast({
        title: "Skill Gaps Detected",
        description: `You need to upskill in ${skillGaps.join(', ')} before job searching—view your advisory report below.`,
        variant: "destructive",
      });
      return;
    }

    if (student.credits <= 0) {
      toast({
        title: "No Credits Remaining",
        description: "You've used all your free scans. Purchase more credits to continue.",
        variant: "destructive",
      });
      return;
    }

    setJobScanLoading(true);
    
    try {
      // Call job scan endpoint
      const { data, error } = await supabase.functions.invoke('scanJobs', {
        body: { profile_id: student.id }
      });

      if (error) throw error;

      toast({
        title: "Job Scan Started",
        description: "Scanning for relevant healthcare positions...",
      });
      
      // Navigate to job scan results
      navigate('/job-scan');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start job scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJobScanLoading(false);
    }
  };

  const handleAdvisoryReport = () => {
    navigate('/advisory-report');
  };

  const renderJobScanButton = () => {
    const hasSkillGaps = skillGaps.length > 0;
    const hasCredits = student?.credits > 0;

    if (hasSkillGaps) {
      return (
        <div className="relative">
          <Button 
            disabled 
            className="w-full opacity-50 cursor-not-allowed"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Scan Jobs (Skill Gaps Detected)
          </Button>
          <div className="absolute inset-0 bg-transparent" title={`You need to upskill in ${skillGaps.join(', ')} before job searching—view your advisory report below.`} />
        </div>
      );
    }

    if (!hasCredits) {
      return (
        <div className="space-y-3">
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800 mb-2">3 free tries exhausted. Unlock 3 more uses for $13</p>
            <Button variant="outline" className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Credits
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Button 
        onClick={handleJobScan} 
        disabled={jobScanLoading}
        className="w-full bg-gradient-to-r from-navy-600 to-autumn-500 hover:from-navy-700 hover:to-autumn-600 text-white"
      >
        <Target className="mr-2 h-4 w-4" />
        {jobScanLoading ? 'Starting Scan...' : `Scan Jobs (${student?.credits || 0} credits)`}
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-spin text-navy-600 mx-auto mb-4" />
          <p className="text-lg">Analyzing your profile… please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Your Personalized Career Analysis</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your profile, we've identified the best career opportunities and created a personalized roadmap for your success.
        </p>
      </div>

      {/* Skill Gaps Alert */}
      {skillGaps.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Priority Skills to Upskill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-3">
              You currently lack {skillGaps.length} critical skills. Please complete your personalized learning plan below before searching jobs.
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap, index) => (
                <Badge key={index} variant="outline" className="text-orange-800 border-orange-300">
                  {gap}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Recommendations */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Top Career Matches</h2>
          <div className="flex gap-3">
            {renderJobScanButton()}
            <Button 
              onClick={handleAdvisoryReport}
              variant="outline"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
            >
              <FileText className="mr-2 h-4 w-4" />
              Get Advisory Report
            </Button>
          </div>
        </div>

        {careerRecs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No career recommendations available. Please complete your profile intake first.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerRecs.map((rec, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                  <CardDescription>{rec.description || `${rec.title} position in the healthcare/pharmaceutical sector`}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Match Score</span>
                      <span className="font-medium">{rec.match_score}%</span>
                    </div>
                    <Progress value={rec.match_score} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salary:</span>
                      <span className="font-medium">{rec.salary_range}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Growth:</span>
                      <Badge variant={rec.growth === 'High' ? 'default' : 'secondary'}>
                        {rec.growth}
                      </Badge>
                    </div>
                  </div>

                  {rec.skill_gaps && rec.skill_gaps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Skills to Upskill:</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.skill_gaps.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Analysis;
