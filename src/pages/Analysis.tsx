
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAnalysisData,
  getZaneCourses,
  consumeCredit,
  getUserCredits,
  type CareerRecommendation,
  type SkillGap,
  type AdvisoryReport,
  type Course
} from '@/services/analysisService';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Download, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ExternalLink 
} from 'lucide-react';

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  
  const [careerRecs, setCareerRecs] = useState<CareerRecommendation[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [advisoryReport, setAdvisoryReport] = useState<AdvisoryReport | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jobScanLoading, setJobScanLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAnalysisData();
      loadCredits();
      loadCourses();
    }
  }, [user]);

  const loadAnalysisData = async () => {
    try {
      const data = await getAnalysisData(user.id);
      setCareerRecs(data.careerRecs);
      setSkillGaps(data.skillGaps);
      setAdvisoryReport(data.advisoryReport);
    } catch (error) {
      console.error('Failed to load analysis data:', error);
      toast({
        title: "Error",
        description: "Failed to load analysis data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCredits = async () => {
    try {
      const userCredits = await getUserCredits(user.id);
      setCredits(userCredits);
    } catch (error) {
      console.error('Failed to load credits:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const zaneCourses = await getZaneCourses();
      setCourses(zaneCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const handleJobScan = async () => {
    if (skillGaps.length > 0) {
      toast({
        title: "Skill Gaps Detected",
        description: `You need to upskill in ${skillGaps.map(gap => gap.missing_skill).join(', ')} before job searching—view your advisory report below.`,
        variant: "destructive",
      });
      return;
    }

    if (credits <= 0) {
      toast({
        title: "No Credits Remaining",
        description: "You've used all your free scans. Purchase more credits to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setJobScanLoading(true);
      const result = await consumeCredit(userProfile.id);
      
      if (result.success) {
        setCredits(result.remaining_credits);
        navigate('/job-scan');
        toast({
          title: "Job Scan Started",
          description: `Scanning jobs... ${result.remaining_credits} credits remaining.`,
        });
      } else {
        throw new Error(result.error);
      }
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

  const handleDownloadReport = () => {
    // This would call a Pipedream endpoint or Edge Function
    const reportUrl = `https://your-pipedream-domain/generate-full-report?profile_id=${user.id}`;
    window.open(reportUrl, '_blank');
  };

  const renderJobScanButton = () => {
    const hasSkillGaps = skillGaps.length > 0;
    const hasCredits = credits > 0;

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
          <div className="absolute inset-0 bg-transparent" title={`You need to upskill in ${skillGaps.map(gap => gap.missing_skill).join(', ')} before job searching—view your advisory report below.`} />
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
        className="w-full"
      >
        <Target className="mr-2 h-4 w-4" />
        {jobScanLoading ? 'Starting Scan...' : `Scan Jobs (${credits} credits)`}
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">Analysis in progress… please wait a moment.</p>
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
              Skill Development Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-3">
              You currently lack {skillGaps.length} critical skills. Please complete your personalized learning plan below before searching jobs.
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap) => (
                <Badge key={gap.id} variant="outline" className="text-orange-800 border-orange-300">
                  {gap.missing_skill}
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
          {renderJobScanButton()}
        </div>

        {careerRecs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Analysis in progress… please wait a moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerRecs.map((rec) => (
              <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
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
                      <p className="text-sm font-medium mb-2">Skills to Up-skill:</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.skill_gaps.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
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

      {/* Professional Career Advisory Report */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Professional Career Advisory Report</h2>
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </Button>
        </div>

        {!advisoryReport ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Building your personalized plan… check back in a moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Career Fit Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Career Fit Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Fit Score</span>
                    <span className="font-medium">{advisoryReport.career_fit.score}%</span>
                  </div>
                  <Progress value={advisoryReport.career_fit.score} className="h-2" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Next Actions:</h4>
                  <ul className="space-y-1 text-sm">
                    {advisoryReport.career_fit.next_actions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Skill Development Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Skill Development Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advisoryReport.learning_priorities.map((priority, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{priority.title}</h4>
                        <Badge variant={priority.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {priority.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{priority.timeframe}</p>
                      <p className="text-sm">{priority.next_action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advisoryReport.path_strategy.map((strategy, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{strategy.title}</h4>
                        <Badge variant={strategy.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {strategy.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{strategy.timeframe}</p>
                      <p className="text-sm">{strategy.next_action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* Explore Learning Path */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Explore Learning Path</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                {course.summary && (
                  <CardDescription>{course.summary}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {course.duration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                  )}
                  {course.level && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                  )}
                  {course.price && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                  )}
                </div>

                {course.key_skills && course.key_skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.key_skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`https://zaneproed.com/courses/${course.course_id}`, '_blank')}
                >
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Analysis;
