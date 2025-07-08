import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, User, BookOpen, Award, Target, Brain, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Intake = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    
    // Education Background
    ugDegree: '',
    ugSpecialization: '',
    ugYear: '',
    pgDegree: '',
    pgSpecialization: '',
    pgYear: '',
    
    // Skills & Experience
    technicalSkills: '',
    softSkills: '',
    internships: '',
    projects: '',
    certifications: '',
    
    // Career Goals
    preferredIndustry: '',
    careerGoals: '',
    jobLocations: '',
    salaryExpectation: '',
    workStyle: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/analysis', { state: { studentData: formData } });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <EducationStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <SkillsExperienceStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <CareerGoalsStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-navy-600 hover:text-navy-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-navy-600 to-autumn-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-navy-700 font-bold text-lg">Zane AI</span>
              <p className="text-slate-500 text-xs">by ZaneProEd</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-navy-100 text-navy-700 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4 mr-2" />
              Career Intelligence Intake
            </div>
            <h1 className="text-3xl font-bold text-navy-800 mb-2">Tell Zane AI About Yourself</h1>
            <p className="text-slate-600">Help me understand your profile to build the perfect career path</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mb-8 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-navy-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-100" />
          </div>

          <div className="flex justify-between mt-8 px-4">
            {[
              { step: 1, icon: User, label: "Personal Info", emoji: "👤" },
              { step: 2, icon: BookOpen, label: "Education", emoji: "🎓" },
              { step: 3, icon: Award, label: "Skills & Experience", emoji: "💡" },
              { step: 4, icon: Target, label: "Career Goals", emoji: "🎯" }
            ].map((item) => (
              <div key={item.step} className={`flex flex-col items-center transition-all duration-300 ${currentStep >= item.step ? 'text-navy-600' : 'text-slate-400'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 ${
                  currentStep >= item.step ? 'bg-gradient-to-r from-navy-500 to-autumn-500 shadow-lg scale-110' : 'bg-slate-100'
                }`}>
                  {currentStep >= item.step ? (
                    <item.icon className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-lg">{item.emoji}</span>
                  )}
                </div>
                <span className="text-xs text-center hidden sm:block font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-white border border-slate-200 shadow-xl rounded-xl animate-scale-in">
            <CardContent className="p-8">
              {renderStep()}
              
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 px-6 py-2 rounded-xl transition-all duration-300"
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-navy-600 to-autumn-500 hover:from-navy-700 hover:to-autumn-600 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {currentStep === totalSteps ? (
                    <>
                      Analyze My Profile 
                      <Brain className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16 pb-8">
          <div className="flex items-center justify-center space-x-3 text-slate-400">
            <div className="w-6 h-6 bg-gradient-to-r from-navy-400 to-autumn-400 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm">Powered by ZaneProEd</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalInfoStep = ({ formData, updateFormData }: any) => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-navy-500 to-autumn-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <User className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-navy-800 mb-2">Personal Information</h2>
      <p className="text-slate-600">👤 Let's start with your basic details</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-navy-700 font-medium">Full Name *</Label>
        <Input 
          id="fullName"
          value={formData.fullName}
          onChange={(e) => updateFormData('fullName', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-navy-700 font-medium">Email Address *</Label>
        <Input 
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="your.email@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-navy-700 font-medium">Phone Number</Label>
        <Input 
          id="phone"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="+91 9876543210"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location" className="text-navy-700 font-medium">Current Location *</Label>
        <Input 
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData('location', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="City, State"
        />
      </div>
    </div>
  </div>
);

const EducationStep = ({ formData, updateFormData }: any) => (
  <div className="space-y-8 animate-fade-in">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-navy-500 to-autumn-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-navy-800 mb-2">Education Background</h2>
      <p className="text-slate-600">🎓 Tell me about your academic journey in healthcare</p>
    </div>
    
    <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-navy-400">
      <h3 className="text-lg font-semibold text-navy-700 mb-4">Undergraduate Degree (Optional)</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Degree</Label>
          <Select value={formData.ugDegree} onValueChange={(value) => updateFormData('ugDegree', value)}>
            <SelectTrigger className="bg-white border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg">
              <SelectValue placeholder="Select degree" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              <SelectItem value="bpharm">B.Pharm</SelectItem>
              <SelectItem value="dpharm">D.Pharm</SelectItem>
              <SelectItem value="bsc-nursing">B.Sc Nursing</SelectItem>
              <SelectItem value="gnm">GNM (Nursing)</SelectItem>
              <SelectItem value="bpt">BPT (Physiotherapy)</SelectItem>
              <SelectItem value="bmlt">BMLT (Medical Lab Technology)</SelectItem>
              <SelectItem value="boptom">B.Optom (Optometry)</SelectItem>
              <SelectItem value="btech">B.Tech</SelectItem>
              <SelectItem value="be">B.E.</SelectItem>
              <SelectItem value="bsc">B.Sc</SelectItem>
              <SelectItem value="bcom">B.Com</SelectItem>
              <SelectItem value="ba">B.A.</SelectItem>
              <SelectItem value="bba">BBA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Specialization</Label>
          <Input 
            value={formData.ugSpecialization}
            onChange={(e) => updateFormData('ugSpecialization', e.target.value)}
            className="bg-white border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 rounded-lg"
            placeholder="e.g., Clinical Pharmacy"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Year of Completion</Label>
          <Select value={formData.ugYear} onValueChange={(value) => updateFormData('ugYear', value)}>
            <SelectTrigger className="bg-white border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              {Array.from({length: 36}, (_, i) => 2025 - i).map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <div className="bg-autumn-50 rounded-xl p-6 border-l-4 border-autumn-500">
      <h3 className="text-lg font-semibold text-navy-700 mb-4">Postgraduate Degree</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Degree</Label>
          <Select value={formData.pgDegree} onValueChange={(value) => updateFormData('pgDegree', value)}>
            <SelectTrigger className="bg-white border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg">
              <SelectValue placeholder="Select degree" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              <SelectItem value="pharm-d">Pharm.D</SelectItem>
              <SelectItem value="mpharm">M.Pharm</SelectItem>
              <SelectItem value="msc-nursing">M.Sc Nursing</SelectItem>
              <SelectItem value="mpt">MPT (Physiotherapy)</SelectItem>
              <SelectItem value="mtech">M.Tech</SelectItem>
              <SelectItem value="me">M.E.</SelectItem>
              <SelectItem value="msc">M.Sc</SelectItem>
              <SelectItem value="mcom">M.Com</SelectItem>
              <SelectItem value="ma">M.A.</SelectItem>
              <SelectItem value="mba">MBA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Specialization</Label>
          <Input 
            value={formData.pgSpecialization}
            onChange={(e) => updateFormData('pgSpecialization', e.target.value)}
            className="bg-white border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 rounded-lg"
            placeholder="e.g., Clinical Research, Pharmacology"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Year of Completion</Label>
          <Select value={formData.pgYear} onValueChange={(value) => updateFormData('pgYear', value)}>
            <SelectTrigger className="bg-white border-slate-200 text-navy-800 focus:border-navy-400 rounded-lg">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              {Array.from({length: 36}, (_, i) => 2025 - i).map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
);

const SkillsExperienceStep = ({ formData, updateFormData }: any) => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-navy-500 to-autumn-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Award className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-navy-800 mb-2">Skills & Experience</h2>
      <p className="text-slate-600">💡 Share your healthcare skills, projects, and experiences</p>
    </div>
    
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Technical Skills (Optional)</Label>
        <Textarea 
          value={formData.technicalSkills}
          onChange={(e) => updateFormData('technicalSkills', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="e.g., Clinical data analysis, Healthcare software, Laboratory techniques, Patient care protocols, Drug information systems..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Soft Skills (Optional)</Label>
        <Textarea 
          value={formData.softSkills}
          onChange={(e) => updateFormData('softSkills', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="e.g., Patient communication, Team collaboration, Problem-solving, Attention to detail, Leadership..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Internships & Work Experience (Optional)</Label>
        <Textarea 
          value={formData.internships}
          onChange={(e) => updateFormData('internships', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="Describe your healthcare internships, hospital rotations, clinical experience, or part-time healthcare work..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Projects (Optional)</Label>
        <Textarea 
          value={formData.projects}
          onChange={(e) => updateFormData('projects', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="Describe your healthcare research projects, case studies, clinical projects, or research work..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Certifications (Optional)</Label>
        <Textarea 
          value={formData.certifications}
          onChange={(e) => updateFormData('certifications', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="List any healthcare certifications, GCP training, clinical courses, or specialized learning..."
          rows={2}
        />
      </div>
    </div>
  </div>
);

const CareerGoalsStep = ({ formData, updateFormData }: any) => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-navy-500 to-autumn-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Target className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-navy-800 mb-2">Career Goals & Preferences</h2>
      <p className="text-slate-600">🎯 Help me understand your healthcare career aspirations</p>
    </div>
    
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Preferred Industry *</Label>
        <Select value={formData.preferredIndustry} onValueChange={(value) => updateFormData('preferredIndustry', value)}>
          <SelectTrigger className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 focus:bg-white rounded-lg">
            <SelectValue placeholder="Select your preferred healthcare industry" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 rounded-lg">
            <SelectItem value="clinical-pharmacy">🏥 Clinical Pharmacy & Hospitals</SelectItem>
            <SelectItem value="pharma-industry">🧪 Healthcare Industry</SelectItem>
            <SelectItem value="clinical-research">🔬 Clinical Research & CROs</SelectItem>
            <SelectItem value="regulatory">📋 Regulatory Affairs</SelectItem>
            <SelectItem value="pharma-tech">💻 Healthcare Technology</SelectItem>
            <SelectItem value="academic">🎓 Academia & Teaching</SelectItem>
            <SelectItem value="medical-writing">📝 Medical Writing</SelectItem>
            <SelectItem value="consulting">💼 Healthcare Consulting</SelectItem>
            <SelectItem value="international">🌍 International Opportunities</SelectItem>
            <SelectItem value="entrepreneurship">🚀 Healthcare Entrepreneurship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Career Goals & Aspirations *</Label>
        <Textarea 
          value={formData.careerGoals}
          onChange={(e) => updateFormData('careerGoals', e.target.value)}
          className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
          placeholder="Describe your healthcare career goals, dream job, or what you want to achieve in the next 2-5 years in the healthcare field..."
          rows={4}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Preferred Job Locations</Label>
          <Textarea 
            value={formData.jobLocations}
            onChange={(e) => updateFormData('jobLocations', e.target.value)}
            className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
            placeholder="e.g., Bangalore, Mumbai, Remote, Hyderabad, International..."
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-navy-700 font-medium">Expected Salary Range</Label>
          <Select value={formData.salaryExpectation} onValueChange={(value) => updateFormData('salaryExpectation', value)}>
            <SelectTrigger className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 focus:bg-white rounded-lg">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              <SelectItem value="3-5">₹3-5 LPA</SelectItem>
              <SelectItem value="5-8">₹5-8 LPA</SelectItem>
              <SelectItem value="8-12">₹8-12 LPA</SelectItem>
              <SelectItem value="12-18">₹12-18 LPA</SelectItem>
              <SelectItem value="18+">₹18+ LPA</SelectItem>
              <SelectItem value="international">International Opportunities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-navy-700 font-medium">Work Style Preference</Label>
        <Select value={formData.workStyle} onValueChange={(value) => updateFormData('workStyle', value)}>
          <SelectTrigger className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 focus:bg-white rounded-lg">
            <SelectValue placeholder="Select work style" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 rounded-lg">
            <SelectItem value="clinical-onsite">🏥 Clinical/Hospital - On-site</SelectItem>
            <SelectItem value="hybrid">🏢 Hybrid (2-3 days office)</SelectItem>
            <SelectItem value="remote">💻 Fully Remote</SelectItem>
            <SelectItem value="flexible">⚡ Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

export default Intake;
