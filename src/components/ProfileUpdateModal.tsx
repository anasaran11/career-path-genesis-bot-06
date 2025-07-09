import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, User, Save } from "lucide-react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useToast } from "@/hooks/use-toast";
import { submitIntakeData, IntakeFormData } from "@/services/intakeService";
import { getStudentProfileData } from "@/services/studentAnalysisService";

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { student } = useStudentAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<IntakeFormData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    ugDegree: "",
    ugSpecialization: "",
    ugYear: "",
    pgDegree: "",
    pgSpecialization: "",
    pgYear: "",
    technicalSkills: "",
    softSkills: "",
    internships: "",
    projects: "",
    certifications: "",
    preferredIndustry: "",
    careerGoals: "",
    jobLocations: "",
    salaryExpectation: "",
    workStyle: "",
  });

  useEffect(() => {
    if (isOpen && student) {
      loadProfileData();
    }
  }, [isOpen, student]);

  const loadProfileData = async () => {
    if (!student) return;

    setLoading(true);
    try {
      const profileData = await getStudentProfileData(student.id);
      if (profileData) {
        setFormData({
          fullName: profileData.full_name || student.full_name,
          email: profileData.email || student.email,
          phone: profileData.phone || "",
          location: profileData.location || "",
          ugDegree: profileData.ug_degree || "",
          ugSpecialization: profileData.ug_specialization || "",
          ugYear: profileData.ug_year || "",
          pgDegree: profileData.pg_degree || "",
          pgSpecialization: profileData.pg_specialization || "",
          pgYear: profileData.pg_year || "",
          technicalSkills: profileData.technical_skills || "",
          softSkills: profileData.soft_skills || "",
          internships: profileData.internships || "",
          projects: profileData.projects || "",
          certifications: profileData.certifications || "",
          preferredIndustry: profileData.preferred_industry || "",
          careerGoals: profileData.career_goals || "",
          jobLocations: profileData.job_locations || "",
          salaryExpectation: profileData.salary_expectation || "",
          workStyle: profileData.work_style || "",
        });
      } else {
        // Pre-populate with student data
        setFormData((prev) => ({
          ...prev,
          fullName: student.full_name,
          email: student.email,
        }));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!student) return;

    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields (name and email).",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const result = await submitIntakeData(formData, student.id);

      if (result.success) {
        toast({
          title: "Profile Updated! ✅",
          description: "Your profile has been updated successfully.",
        });

        // Clear cached analysis to trigger re-analysis
        localStorage.removeItem(`analysis_${student.id}`);

        onUpdate?.();
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-navy-600 to-autumn-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-navy-800">
                    Update Profile
                  </CardTitle>
                  <CardDescription>
                    Modify your profile information and preferences
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-600">Loading profile data...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Personal Information */}
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy-800 border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-navy-700 font-medium"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          updateFormData("fullName", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-navy-700 font-medium"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-navy-700 font-medium"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-navy-700 font-medium"
                      >
                        Current Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          updateFormData("location", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </section>

                {/* Education */}
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy-800 border-b pb-2">
                    Education
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-navy-700">
                        Undergraduate Degree
                      </h4>
                      <div className="space-y-3">
                        <Select
                          value={formData.ugDegree}
                          onValueChange={(value) =>
                            updateFormData("ugDegree", value)
                          }
                        >
                          <SelectTrigger className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg">
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bpharm">B.Pharm</SelectItem>
                            <SelectItem value="dpharm">D.Pharm</SelectItem>
                            <SelectItem value="bsc-nursing">
                              B.Sc Nursing
                            </SelectItem>
                            <SelectItem value="gnm">GNM (Nursing)</SelectItem>
                            <SelectItem value="bpt">
                              BPT (Physiotherapy)
                            </SelectItem>
                            <SelectItem value="bmlt">
                              BMLT (Medical Lab Technology)
                            </SelectItem>
                            <SelectItem value="boptom">
                              B.Optom (Optometry)
                            </SelectItem>
                            <SelectItem value="btech">B.Tech</SelectItem>
                            <SelectItem value="be">B.E.</SelectItem>
                            <SelectItem value="bsc">B.Sc</SelectItem>
                            <SelectItem value="bcom">B.Com</SelectItem>
                            <SelectItem value="ba">B.A.</SelectItem>
                            <SelectItem value="bba">BBA</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={formData.ugSpecialization}
                          onChange={(e) =>
                            updateFormData("ugSpecialization", e.target.value)
                          }
                          placeholder="Specialization"
                          className="bg-slate-50 border-slate-200 rounded-lg"
                        />
                        <Select
                          value={formData.ugYear}
                          onValueChange={(value) =>
                            updateFormData("ugYear", value)
                          }
                        >
                          <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 36 }, (_, i) => 2025 - i).map(
                              (year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-navy-700">
                        Postgraduate Degree
                      </h4>
                      <div className="space-y-3">
                        <Select
                          value={formData.pgDegree}
                          onValueChange={(value) =>
                            updateFormData("pgDegree", value)
                          }
                        >
                          <SelectTrigger className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg">
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pharm-d">Pharm.D</SelectItem>
                            <SelectItem value="mpharm">M.Pharm</SelectItem>
                            <SelectItem value="msc-nursing">
                              M.Sc Nursing
                            </SelectItem>
                            <SelectItem value="mpt">
                              MPT (Physiotherapy)
                            </SelectItem>
                            <SelectItem value="mtech">M.Tech</SelectItem>
                            <SelectItem value="me">M.E.</SelectItem>
                            <SelectItem value="msc">M.Sc</SelectItem>
                            <SelectItem value="mcom">M.Com</SelectItem>
                            <SelectItem value="ma">M.A.</SelectItem>
                            <SelectItem value="mba">MBA</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={formData.pgSpecialization}
                          onChange={(e) =>
                            updateFormData("pgSpecialization", e.target.value)
                          }
                          placeholder="Specialization"
                          className="bg-slate-50 border-slate-200 rounded-lg"
                        />
                        <Select
                          value={formData.pgYear}
                          onValueChange={(value) =>
                            updateFormData("pgYear", value)
                          }
                        >
                          <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 36 }, (_, i) => 2025 - i).map(
                              (year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Skills & Experience */}
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy-800 border-b pb-2">
                    Skills & Experience
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Technical Skills
                      </Label>
                      <Textarea
                        value={formData.technicalSkills}
                        onChange={(e) =>
                          updateFormData("technicalSkills", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 rounded-lg"
                        rows={3}
                        placeholder="e.g., Clinical research, GCP training..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Soft Skills
                      </Label>
                      <Textarea
                        value={formData.softSkills}
                        onChange={(e) =>
                          updateFormData("softSkills", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 rounded-lg"
                        rows={3}
                        placeholder="e.g., Communication, leadership..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Experience & Internships
                      </Label>
                      <Textarea
                        value={formData.internships}
                        onChange={(e) =>
                          updateFormData("internships", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 rounded-lg"
                        rows={3}
                        placeholder="Describe your experience..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Certifications
                      </Label>
                      <Textarea
                        value={formData.certifications}
                        onChange={(e) =>
                          updateFormData("certifications", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 rounded-lg"
                        rows={3}
                        placeholder="List your certifications..."
                      />
                    </div>
                  </div>
                </section>

                {/* Career Preferences */}
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy-800 border-b pb-2">
                    Career Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Preferred Industry
                      </Label>
                      <Select
                        value={formData.preferredIndustry}
                        onValueChange={(value) =>
                          updateFormData("preferredIndustry", value)
                        }
                      >
                        <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinical-research">
                            Clinical Research
                          </SelectItem>
                          <SelectItem value="regulatory-affairs">
                            Regulatory Affairs
                          </SelectItem>
                          <SelectItem value="medical-writing">
                            Medical Writing
                          </SelectItem>
                          <SelectItem value="pharmacovigilance">
                            Pharmacovigilance
                          </SelectItem>
                          <SelectItem value="healthcare-data-analytics">
                            Healthcare Data Analytics
                          </SelectItem>
                          <SelectItem value="clinical-pharmacy">
                            Clinical Pharmacy & Hospitals
                          </SelectItem>
                          <SelectItem value="pharma-industry">
                            Healthcare Industry
                          </SelectItem>
                          <SelectItem value="pharma-tech">
                            Healthcare Technology
                          </SelectItem>
                          <SelectItem value="academic">
                            Academia & Teaching
                          </SelectItem>
                          <SelectItem value="consulting">
                            Healthcare Consulting
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Work Style
                      </Label>
                      <Select
                        value={formData.workStyle}
                        onValueChange={(value) =>
                          updateFormData("workStyle", value)
                        }
                      >
                        <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                          <SelectValue placeholder="Select work style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinical-onsite">
                            Clinical/Hospital - On-site
                          </SelectItem>
                          <SelectItem value="hybrid">
                            Hybrid (2-3 days office)
                          </SelectItem>
                          <SelectItem value="remote">Fully Remote</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Preferred Locations
                      </Label>
                      <Textarea
                        value={formData.jobLocations}
                        onChange={(e) =>
                          updateFormData("jobLocations", e.target.value)
                        }
                        className="bg-slate-50 border-slate-200 rounded-lg"
                        rows={2}
                        placeholder="e.g., Bangalore, Mumbai, Remote..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-navy-700 font-medium">
                        Salary Expectation
                      </Label>
                      <Select
                        value={formData.salaryExpectation}
                        onValueChange={(value) =>
                          updateFormData("salaryExpectation", value)
                        }
                      >
                        <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-5">₹3-5 LPA</SelectItem>
                          <SelectItem value="5-8">₹5-8 LPA</SelectItem>
                          <SelectItem value="8-12">₹8-12 LPA</SelectItem>
                          <SelectItem value="12-18">₹12-18 LPA</SelectItem>
                          <SelectItem value="18+">₹18+ LPA</SelectItem>
                          <SelectItem value="international">
                            International Opportunities
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-navy-700 font-medium">
                      Career Goals
                    </Label>
                    <Textarea
                      value={formData.careerGoals}
                      onChange={(e) =>
                        updateFormData("careerGoals", e.target.value)
                      }
                      className="bg-slate-50 border-slate-200 rounded-lg"
                      rows={3}
                      placeholder="Describe your career goals and aspirations..."
                    />
                  </div>
                </section>
              </div>
            )}
          </CardContent>

          <div className="flex justify-end space-x-3 p-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-gradient-to-r from-navy-600 to-autumn-500 hover:from-navy-700 hover:to-autumn-600 text-white"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
