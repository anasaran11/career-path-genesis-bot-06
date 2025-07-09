import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import {
  analyzeStudentProfile,
  getCachedAnalysisResults,
  CareerRecommendation,
} from "@/services/studentAnalysisService";
import ProfileUpdateModal from "@/components/ProfileUpdateModal";
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
  FileText,
  Sparkles,
  Settings,
  User,
} from "lucide-react";

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { student } = useStudentAuth();

  const [careerRecs, setCareerRecs] = useState<CareerRecommendation[]>([]);
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobScanLoading, setJobScanLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (student) {
      loadAnalysisData();
    }
  }, [student]);

  const loadAnalysisData = async () => {
    try {
      console.log("Starting profile analysis for student:", student.id);

      // Try to get cached results first
      const cachedResults = await getCachedAnalysisResults(student.id);
      if (cachedResults) {
        console.log("Using cached analysis results");
        setCareerRecs(cachedResults.career_recs || []);
        setSkillGaps(cachedResults.skill_gaps || []);
        setLoading(false);
        return;
      }

      // Generate new analysis
      console.log("Generating new analysis...");
      const analysisResult = await analyzeStudentProfile(student.id);

      console.log("Analysis completed:", analysisResult);

      setCareerRecs(analysisResult.career_recs || []);
      setSkillGaps(analysisResult.skill_gaps || []);

      toast({
        title: "Analysis Complete! 🎉",
        description: "Your career profile has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Failed to load analysis data:", error);
      toast({
        title: "Analysis Error",
        description: `Failed to analyze your profile: ${error.message}. Please try again.`,
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
        description: `You need to upskill in ${skillGaps.join(", ")} before job searching—view your advisory report below.`,
        variant: "destructive",
      });
      return;
    }

    if (student.credits <= 0) {
      toast({
        title: "No Credits Remaining",
        description:
          "You've used all your free scans. Purchase more credits to continue.",
        variant: "destructive",
      });
      return;
    }

    setJobScanLoading(true);

    try {
      // Simulate job scan - navigate to job scan results
      toast({
        title: "Job Scan Started",
        description: "Scanning for relevant healthcare positions...",
      });

      setTimeout(() => {
        navigate("/job-scan");
      }, 1500);
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
    navigate("/advisory-report");
  };

  const handleRefreshAnalysis = async () => {
    setLoading(true);

    // Clear cached data
    localStorage.removeItem(`analysis_${student.id}`);

    // Re-run analysis
    await loadAnalysisData();
  };

  const handleProfileUpdate = () => {
    // Re-run analysis after profile update
    handleRefreshAnalysis();
  };

  const renderJobScanButton = () => {
    const hasSkillGaps = skillGaps.length > 0;
    const hasCredits = student?.credits > 0;

    if (hasSkillGaps) {
      return (
        <div className="relative">
          <Button disabled className="w-full opacity-50 cursor-not-allowed">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Scan Jobs (Skill Gaps Detected)
          </Button>
          <div
            className="absolute inset-0 bg-transparent"
            title={`You need to upskill in ${skillGaps.join(", ")} before job searching—view your advisory report below.`}
          />
        </div>
      );
    }

    if (!hasCredits) {
      return (
        <div className="space-y-3">
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800 mb-2">
              3 free tries exhausted. Unlock 3 more uses for $13
            </p>
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
        {jobScanLoading
          ? "Starting Scan..."
          : `Scan Jobs (${student?.credits || 0} credits)`}
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <Brain className="w-16 h-16 animate-pulse text-navy-600 mx-auto mb-4" />
            <Sparkles className="w-8 h-8 text-autumn-500 absolute top-0 right-1/2 transform translate-x-8 animate-bounce" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-2">
              Analyzing Your Profile
            </h2>
            <p className="text-lg text-slate-600 mb-4">
              Zane AI is processing your career data...
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={75} className="h-3 bg-slate-100" />
              <p className="text-sm text-slate-500 mt-2">
                This may take a few moments
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-navy-600 to-autumn-500 rounded-xl flex items-center justify-center mr-3">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-navy-800">
            Your Personalized Career Analysis
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your profile, we've identified the best career opportunities
          and created a personalized roadmap for your success.
        </p>
        <div className="flex justify-center space-x-3">
          <Button onClick={handleRefreshAnalysis} variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Refresh Analysis
          </Button>
          <Button
            onClick={() => setShowProfileModal(true)}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Settings className="mr-2 h-4 w-4" />
            Update Profile
          </Button>
        </div>
      </div>

      {/* Profile Summary Card */}
      {student && (
        <Card className="bg-gradient-to-r from-navy-50 to-autumn-50 border-navy-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-navy-600 to-autumn-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-navy-800">
                  {student.full_name}
                </h3>
                <p className="text-slate-600">
                  {student.email} • {student.institution}
                </p>
              </div>
              <Button
                onClick={() => setShowProfileModal(true)}
                variant="outline"
                size="sm"
                className="bg-white border-navy-200 text-navy-700 hover:bg-navy-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              You currently lack {skillGaps.length} critical skills. Please
              complete your personalized learning plan below before searching
              jobs.
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-orange-800 border-orange-300"
                >
                  {gap}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message for No Skill Gaps */}
      {skillGaps.length === 0 && careerRecs.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Ready for Job Search!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Great news! Your profile shows strong alignment with healthcare
              careers. You're ready to start applying for positions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Career Recommendations */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold">Top Career Matches</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
              <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No Analysis Data Found
              </h3>
              <p className="text-muted-foreground mb-4">
                Please complete your profile intake first to get personalized
                career recommendations.
              </p>
              <Button
                onClick={() => navigate("/intake")}
                className="bg-gradient-to-r from-navy-600 to-autumn-500 text-white"
              >
                Complete Profile Intake
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerRecs.map((rec, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">
                        {rec.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {rec.description}
                      </CardDescription>
                    </div>
                    <div className="ml-2">
                      <Badge
                        variant={
                          rec.match_score >= 80
                            ? "default"
                            : rec.match_score >= 60
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {rec.match_score}% Match
                      </Badge>
                    </div>
                  </div>
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
                      <Badge
                        variant={
                          rec.growth === "High" ? "default" : "secondary"
                        }
                      >
                        {rec.growth}
                      </Badge>
                    </div>
                  </div>

                  {rec.skill_gaps && rec.skill_gaps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Skills to Upskill:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rec.skill_gaps.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="outline"
                            className="text-xs"
                          >
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

      {/* Call to Action */}
      {careerRecs.length > 0 && (
        <Card className="bg-gradient-to-r from-navy-50 to-autumn-50 border-navy-200">
          <CardContent className="text-center py-8">
            <Brain className="w-12 h-12 text-navy-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-navy-800 mb-2">
              Ready to Take the Next Step?
            </h3>
            <p className="text-slate-600 mb-4">
              Get your detailed advisory report with specific action items and
              learning priorities.
            </p>
            <Button
              onClick={handleAdvisoryReport}
              className="bg-gradient-to-r from-navy-600 to-autumn-500 hover:from-navy-700 hover:to-autumn-600 text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Detailed Advisory Report
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Profile Update Modal */}
      <ProfileUpdateModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Analysis;
