import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, TrendingUp, Target, Star, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('Analyzing your pharmaceutical profile...');
  const studentData = location.state?.studentData || {};
  const analysisPhases = ['Analyzing your pharmaceutical profile...', 'Matching your interests with pharmacy careers...', 'Identifying optimal pharmaceutical paths...', 'Calculating career compatibility scores...', 'Generating personalized recommendations...'];
  useEffect(() => {
    let phase = 0;
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          setIsAnalyzing(false);
          clearInterval(interval);
          return 100;
        }
        if (newProgress > (phase + 1) * 20) {
          phase++;
          if (phase < analysisPhases.length) {
            setCurrentPhase(analysisPhases[phase]);
          }
        }
        return newProgress;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  const careerPaths = [
  // Clinical & Hospital Roles
  {
    title: "Clinical Pharmacist",
    compatibility: 95,
    description: "Provide pharmaceutical care in clinical settings, working directly with patients and healthcare teams",
    skills: ["Clinical Knowledge", "Patient Counseling", "Drug Interactions", "Medication Therapy Management"],
    growth: "High",
    salaryRange: "₹6-12 LPA",
    companies: ["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "AIIMS"],
    category: "🔬 Clinical & Hospital Roles"
  }, {
    title: "ICU/Hospital Pharmacy Specialist",
    compatibility: 90,
    description: "Specialized pharmaceutical care in intensive care and critical care environments",
    skills: ["Critical Care Protocols", "IV Admixtures", "Emergency Medications", "Clinical Monitoring"],
    growth: "High",
    salaryRange: "₹8-15 LPA",
    companies: ["Manipal Hospitals", "Narayana Health", "Medanta", "PGIMER"],
    category: "🔬 Clinical & Hospital Roles"
  }, {
    title: "Ward Pharmacist",
    compatibility: 88,
    description: "Provide pharmaceutical services directly to hospital wards and patient care units",
    skills: ["Ward Rounding", "Medication History", "Discharge Counseling", "Clinical Documentation"],
    growth: "High",
    salaryRange: "₹5-10 LPA",
    companies: ["AIIMS", "Christian Medical College", "Armed Forces Medical College", "KEM Hospital"],
    category: "🔬 Clinical & Hospital Roles"
  }, {
    title: "Medication Therapy Management (MTM) Specialist",
    compatibility: 86,
    description: "Optimize medication therapy outcomes through comprehensive medication reviews",
    skills: ["Pharmaceutical Care", "Patient Assessment", "Drug Utilization Review", "Clinical Documentation"],
    growth: "Very High",
    salaryRange: "₹7-13 LPA",
    companies: ["CVS Health", "Walgreens", "Apollo Pharmacy", "MedPlus"],
    category: "🔬 Clinical & Hospital Roles"
  },
  // Pharma Industry Roles
  {
    title: "Pharmacovigilance Associate",
    compatibility: 85,
    description: "Monitor and assess drug safety data to ensure medication safety for patients",
    skills: ["Drug Safety", "Adverse Event Reporting", "Regulatory Guidelines", "Medical Coding"],
    growth: "Very High",
    salaryRange: "₹5-10 LPA",
    companies: ["Cognizant", "Accenture", "TCS", "Wipro"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Clinical Research Associate (CRA)",
    compatibility: 82,
    description: "Monitor clinical trials and ensure compliance with regulatory standards",
    skills: ["GCP Guidelines", "Protocol Review", "Site Monitoring", "Data Verification"],
    growth: "High",
    salaryRange: "₹6-12 LPA",
    companies: ["Quintiles", "IQVIA", "Parexel", "ICON"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Regulatory Affairs Specialist",
    compatibility: 80,
    description: "Ensure pharmaceutical compliance with regulatory standards and drug approvals",
    skills: ["Regulatory Guidelines", "Documentation", "Quality Assurance", "Drug Approval Process"],
    growth: "Very High",
    salaryRange: "₹8-15 LPA",
    companies: ["Sun Pharma", "Dr. Reddy's", "Cipla", "Lupin"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Medical Affairs Specialist",
    compatibility: 78,
    description: "Bridge scientific and commercial teams, provide medical expertise for pharmaceutical products",
    skills: ["Medical Knowledge", "Scientific Communication", "KOL Management", "Publication Support"],
    growth: "High",
    salaryRange: "₹10-18 LPA",
    companies: ["Novartis", "Pfizer", "GSK", "Abbott"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Quality Assurance (QA) Specialist",
    compatibility: 76,
    description: "Ensure pharmaceutical manufacturing processes meet quality standards and regulations",
    skills: ["GMP Guidelines", "Quality Systems", "Audit Management", "Validation Protocols"],
    growth: "Medium",
    salaryRange: "₹6-12 LPA",
    companies: ["Biocon", "Cadila Healthcare", "Glenmark", "Torrent Pharma"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Quality Control (QC) Analyst",
    compatibility: 74,
    description: "Test pharmaceutical products to ensure they meet quality specifications",
    skills: ["Analytical Testing", "HPLC/GC", "Method Validation", "Laboratory Management"],
    growth: "Medium",
    salaryRange: "₹4-8 LPA",
    companies: ["Ranbaxy", "Aurobindo Pharma", "Hetero Drugs", "Mylan"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Clinical Data Management (CDM) Specialist",
    compatibility: 72,
    description: "Manage and maintain clinical trial data throughout the research process",
    skills: ["Clinical Databases", "Data Review", "EDC Systems", "Statistical Software"],
    growth: "High",
    salaryRange: "₹7-14 LPA",
    companies: ["Covance", "PPD", "Syneos Health", "Charles River"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Medical Science Liaison (MSL)",
    compatibility: 70,
    description: "Bridge between pharmaceutical companies and healthcare professionals",
    skills: ["Scientific Communication", "Medical Knowledge", "Presentation Skills", "Relationship Management"],
    growth: "High",
    salaryRange: "₹12-25 LPA",
    companies: ["Roche", "Merck", "Johnson & Johnson", "AstraZeneca"],
    category: "🧪 Pharma Industry Roles"
  }, {
    title: "Scientific Affairs Manager",
    compatibility: 68,
    description: "Lead scientific strategy and communication for pharmaceutical products",
    skills: ["Scientific Strategy", "Cross-functional Leadership", "Market Access", "Evidence Generation"],
    growth: "High",
    salaryRange: "₹15-30 LPA",
    companies: ["Sanofi", "Bayer", "Eli Lilly", "Bristol Myers Squibb"],
    category: "🧪 Pharma Industry Roles"
  },
  // Tech-Integrated Pharma Roles
  {
    title: "Healthcare Data Analyst",
    compatibility: 75,
    description: "Analyze healthcare data to improve patient outcomes and operational efficiency",
    skills: ["Data Analysis", "Healthcare Informatics", "Statistical Software", "Database Management"],
    growth: "Very High",
    salaryRange: "₹8-16 LPA",
    companies: ["Practo", "1mg", "PharmEasy", "HealthifyMe"],
    category: "🖥️ Tech-Integrated Pharma Roles"
  }, {
    title: "RPA Developer in Pharma",
    compatibility: 65,
    description: "Develop robotic process automation solutions for pharmaceutical operations",
    skills: ["RPA Tools", "Process Automation", "Pharmaceutical Processes", "Programming"],
    growth: "Very High",
    salaryRange: "₹10-20 LPA",
    companies: ["UiPath", "Automation Anywhere", "Blue Prism", "Infosys"],
    category: "🖥️ Tech-Integrated Pharma Roles"
  }, {
    title: "Health Informatics Specialist",
    compatibility: 72,
    description: "Implement and manage healthcare information systems and electronic health records",
    skills: ["Health IT Systems", "EHR Management", "Data Security", "System Integration"],
    growth: "Very High",
    salaryRange: "₹10-18 LPA",
    companies: ["Epic Systems", "Cerner", "Allscripts", "eClinicalWorks"],
    category: "🖥️ Tech-Integrated Pharma Roles"
  }, {
    title: "AI in Drug Discovery",
    compatibility: 60,
    description: "Apply artificial intelligence and machine learning to pharmaceutical research",
    skills: ["Machine Learning", "Drug Discovery", "Bioinformatics", "Python/R Programming"],
    growth: "Very High",
    salaryRange: "₹15-35 LPA",
    companies: ["Atomwise", "BenevolentAI", "Insilico Medicine", "Deep Genomics"],
    category: "🖥️ Tech-Integrated Pharma Roles"
  }, {
    title: "Medical Data Reviewer",
    compatibility: 70,
    description: "Review and validate medical data for clinical trials and pharmaceutical research",
    skills: ["Medical Coding", "Data Review", "Clinical Knowledge", "Attention to Detail"],
    growth: "Medium",
    salaryRange: "₹6-12 LPA",
    companies: ["IQVIA", "Syneos Health", "Parexel", "PRA Health Sciences"],
    category: "🖥️ Tech-Integrated Pharma Roles"
  },
  // Writing & Content Roles
  {
    title: "Medical Writer",
    compatibility: 70,
    description: "Create scientific and medical content for regulatory submissions and publications",
    skills: ["Medical Writing", "Regulatory Documentation", "Scientific Communication", "Research Skills"],
    growth: "High",
    salaryRange: "₹6-14 LPA",
    companies: ["Covance", "PPD", "Syneos Health", "Fresenius Kabi"],
    category: "📝 Writing & Content Roles"
  }, {
    title: "Scientific Content Creator",
    compatibility: 65,
    description: "Develop educational and promotional scientific content for pharmaceutical companies",
    skills: ["Content Creation", "Medical Communication", "Digital Marketing", "Scientific Knowledge"],
    growth: "High",
    salaryRange: "₹5-12 LPA",
    companies: ["Medscape", "WebMD", "Pharmaceutical Companies", "Medical Education Companies"],
    category: "📝 Writing & Content Roles"
  }, {
    title: "Drug Monograph Writer",
    compatibility: 68,
    description: "Write comprehensive drug monographs and pharmaceutical reference materials",
    skills: ["Pharmacology", "Drug Information", "Technical Writing", "Research Skills"],
    growth: "Medium",
    salaryRange: "₹4-10 LPA",
    companies: ["Lexicomp", "Micromedex", "Clinical Pharmacology", "Drug Information Centers"],
    category: "📝 Writing & Content Roles"
  }, {
    title: "Healthcare Copywriter",
    compatibility: 62,
    description: "Create marketing and promotional content for pharmaceutical and healthcare companies",
    skills: ["Copywriting", "Healthcare Marketing", "Creative Writing", "Brand Communication"],
    growth: "Medium",
    salaryRange: "₹4-8 LPA",
    companies: ["Healthcare Ad Agencies", "Pharmaceutical Marketing", "Digital Health Companies", "Medical Device Companies"],
    category: "📝 Writing & Content Roles"
  },
  // Academia & Training
  {
    title: "Pharm.D Lecturer",
    compatibility: 75,
    description: "Teach pharmaceutical sciences and clinical pharmacy to Pharm.D students",
    skills: ["Teaching", "Curriculum Development", "Research", "Academic Writing"],
    growth: "Medium",
    salaryRange: "₹6-15 LPA",
    companies: ["Pharmacy Colleges", "Universities", "Medical Colleges", "Educational Institutions"],
    category: "🎓 Academia & Training"
  }, {
    title: "Clinical Skills Trainer",
    compatibility: 72,
    description: "Train healthcare professionals in clinical pharmacy skills and practices",
    skills: ["Training & Development", "Clinical Knowledge", "Presentation Skills", "Curriculum Design"],
    growth: "Medium",
    salaryRange: "₹5-12 LPA",
    companies: ["Hospitals", "Training Organizations", "Pharmaceutical Companies", "Healthcare Institutions"],
    category: "🎓 Academia & Training"
  }, {
    title: "Medical/Pharma E-learning Content Developer",
    compatibility: 70,
    description: "Develop online educational content for pharmaceutical and medical training",
    skills: ["E-learning Development", "Instructional Design", "Medical Knowledge", "Technology Skills"],
    growth: "High",
    salaryRange: "₹6-14 LPA",
    companies: ["E-learning Companies", "Educational Technology", "Pharmaceutical Training", "Medical Education"],
    category: "🎓 Academia & Training"
  },
  // International Certifications/Jobs
  {
    title: "NABP Licensing (NAPLEX, FPGEE – USA)",
    compatibility: 68,
    description: "Prepare for and obtain US pharmacy licensing for international opportunities",
    skills: ["US Pharmacy Law", "Clinical Knowledge", "Exam Preparation", "International Guidelines"],
    growth: "Very High",
    salaryRange: "$60,000-120,000 (USA)",
    companies: ["US Hospitals", "CVS Health", "Walgreens", "US Pharmacy Chains"],
    category: "🌍 International Certifications"
  }, {
    title: "PEBC (Canada)",
    compatibility: 65,
    description: "Canadian pharmacy certification for practicing pharmacy in Canada",
    skills: ["Canadian Pharmacy Practice", "Drug Information", "Patient Care", "Regulatory Knowledge"],
    growth: "High",
    salaryRange: "CAD 80,000-130,000",
    companies: ["Canadian Hospitals", "Shoppers Drug Mart", "Rexall", "Canadian Pharmacy Chains"],
    category: "🌍 International Certifications"
  }, {
    title: "DHA/MOH/HAAD (UAE)",
    compatibility: 70,
    description: "UAE pharmacy licensing for practicing in Dubai and other Emirates",
    skills: ["UAE Pharmacy Law", "Clinical Practice", "Arabic Language (Basic)", "Middle East Healthcare"],
    growth: "High",
    salaryRange: "AED 8,000-18,000/month",
    companies: ["UAE Hospitals", "NMC Healthcare", "Aster DM Healthcare", "UAE Pharmacy Chains"],
    category: "🌍 International Certifications"
  }, {
    title: "APHRA (Australia)",
    compatibility: 62,
    description: "Australian pharmacy registration for practicing in Australia",
    skills: ["Australian Pharmacy Practice", "Clinical Knowledge", "English Proficiency", "Australian Healthcare System"],
    growth: "High",
    salaryRange: "AUD 70,000-110,000",
    companies: ["Australian Hospitals", "Chemist Warehouse", "Priceline Pharmacy", "Terry White Chemmart"],
    category: "🌍 International Certifications"
  }, {
    title: "GP Registration (UK – OSPAP route)",
    compatibility: 60,
    description: "UK pharmacy registration through Overseas Pharmacists Assessment Programme",
    skills: ["UK Pharmacy Practice", "Clinical Knowledge", "English Proficiency", "UK Healthcare System"],
    growth: "Medium",
    salaryRange: "£30,000-55,000",
    companies: ["NHS", "Boots", "LloydsPharmacy", "UK Hospital Trusts"],
    category: "🌍 International Certifications"
  },
  // Entrepreneurship & Freelance
  {
    title: "Online Pharma Educator",
    compatibility: 65,
    description: "Create and deliver online pharmaceutical education content and courses",
    skills: ["Online Teaching", "Content Creation", "Digital Marketing", "Educational Technology"],
    growth: "High",
    salaryRange: "₹3-15 LPA (Freelance)",
    companies: ["Independent", "Online Platforms", "EdTech Companies", "Pharmaceutical Training"],
    category: "💼 Entrepreneurship & Freelance"
  }, {
    title: "Freelance Medical Writer",
    compatibility: 68,
    description: "Provide medical writing services on a freelance basis",
    skills: ["Medical Writing", "Client Management", "Business Development", "Regulatory Knowledge"],
    growth: "High",
    salaryRange: "₹30-150/hour",
    companies: ["Independent", "Freelance Platforms", "Pharmaceutical Consulting", "Medical Communications"],
    category: "💼 Entrepreneurship & Freelance"
  }, {
    title: "Healthcare Startup Founder",
    compatibility: 55,
    description: "Start your own healthcare or pharmaceutical technology company",
    skills: ["Entrepreneurship", "Business Development", "Leadership", "Innovation"],
    growth: "Variable",
    salaryRange: "Variable",
    companies: ["Independent", "Incubators", "Venture Capital", "Healthcare Accelerators"],
    category: "💼 Entrepreneurship & Freelance"
  }, {
    title: "Clinical Pharmacy Consultant",
    compatibility: 70,
    description: "Provide specialized clinical pharmacy consulting services",
    skills: ["Clinical Expertise", "Consulting Skills", "Business Development", "Project Management"],
    growth: "High",
    salaryRange: "₹800-3000/day",
    companies: ["Independent", "Consulting Firms", "Hospitals", "Pharmaceutical Companies"],
    category: "💼 Entrepreneurship & Freelance"
  },
  // Alternative & Hybrid Careers
  {
    title: "Medical Coding",
    compatibility: 65,
    description: "Code medical diagnoses and procedures for healthcare billing and documentation",
    skills: ["ICD-10 Coding", "CPT Coding", "Medical Terminology", "Healthcare Documentation"],
    growth: "High",
    salaryRange: "₹3-8 LPA",
    companies: ["Healthcare BPOs", "Insurance Companies", "Hospitals", "Medical Coding Companies"],
    category: "📱 Alternative & Hybrid Careers"
  }, {
    title: "Health Tech Product Manager",
    compatibility: 60,
    description: "Manage health technology products and digital health solutions",
    skills: ["Product Management", "Healthcare Knowledge", "Technology Understanding", "Market Analysis"],
    growth: "Very High",
    salaryRange: "₹12-25 LPA",
    companies: ["Health Tech Startups", "Digital Health Companies", "Pharmaceutical Tech", "Healthcare Apps"],
    category: "📱 Alternative & Hybrid Careers"
  }, {
    title: "Digital Health Specialist",
    compatibility: 58,
    description: "Develop and implement digital health solutions and strategies",
    skills: ["Digital Health", "Technology Implementation", "Healthcare Strategy", "Change Management"],
    growth: "Very High",
    salaryRange: "₹10-20 LPA",
    companies: ["Digital Health Companies", "Telemedicine", "Health Apps", "Healthcare Technology"],
    category: "📱 Alternative & Hybrid Careers"
  }, {
    title: "Medical Marketing & Sales",
    compatibility: 62,
    description: "Market and sell pharmaceutical products to healthcare professionals",
    skills: ["Sales Skills", "Medical Knowledge", "Relationship Building", "Market Analysis"],
    growth: "High",
    salaryRange: "₹4-12 LPA + Incentives",
    companies: ["Pharmaceutical Companies", "Medical Device Companies", "Healthcare Sales", "Biotech Companies"],
    category: "📱 Alternative & Hybrid Careers"
  }, {
    title: "Pharma Market Research Analyst",
    compatibility: 64,
    description: "Analyze pharmaceutical markets and provide strategic insights",
    skills: ["Market Research", "Data Analysis", "Strategic Thinking", "Industry Knowledge"],
    growth: "High",
    salaryRange: "₹6-15 LPA",
    companies: ["Market Research Firms", "Consulting Companies", "Pharmaceutical Companies", "Healthcare Analytics"],
    category: "📱 Alternative & Hybrid Careers"
  }];
  const skillGaps = [{
    skill: "Good Clinical Practice (GCP)",
    priority: "High",
    timeToLearn: "2-3 months",
    category: "Clinical Research"
  }, {
    skill: "Pharmacovigilance & Drug Safety",
    priority: "High",
    timeToLearn: "2-3 months",
    category: "Drug Safety"
  }, {
    skill: "Clinical Data Management",
    priority: "Medium",
    timeToLearn: "3-4 months",
    category: "Data Management"
  }, {
    skill: "Regulatory Writing",
    priority: "Medium",
    timeToLearn: "2-3 months",
    category: "Documentation"
  }, {
    skill: "Healthcare Informatics",
    priority: "Medium",
    timeToLearn: "4-6 months",
    category: "Technology"
  }, {
    skill: "Medical Coding (ICD-10)",
    priority: "Low",
    timeToLearn: "2-3 months",
    category: "Healthcare IT"
  }, {
    skill: "Clinical Pharmacy Skills",
    priority: "High",
    timeToLearn: "6-12 months",
    category: "Clinical Practice"
  }, {
    skill: "Pharmaceutical Quality Systems",
    priority: "Medium",
    timeToLearn: "3-6 months",
    category: "Quality Assurance"
  }];
  if (isAnalyzing) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="bg-white border-slate-200 shadow-2xl max-w-md w-full mx-4 animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="relative mb-6">
                <Brain className="w-16 h-16 text-navy-600 mx-auto animate-pulse" />
                <Sparkles className="w-6 h-6 text-autumn-500 absolute top-0 right-6 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-navy-800 mb-2">Zane AI is Analyzing</h2>
              <p className="text-slate-600">Processing your pharmaceutical profile to find perfect career matches</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-navy-700 font-medium">{currentPhase}</span>
                <span className="text-slate-500">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-3 bg-slate-100" />
            </div>
          </CardContent>
        </Card>
      </div>;
  }

  // Group career paths by category
  const groupedPaths = careerPaths.reduce((acc, path) => {
    if (!acc[path.category]) {
      acc[path.category] = [];
    }
    acc[path.category].push(path);
    return acc;
  }, {} as Record<string, typeof careerPaths>);
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/intake" className="flex items-center space-x-2 text-navy-600 hover:text-navy-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Intake</span>
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
        {/* Analysis Summary */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              🎉 Analysis Complete
            </div>
            <h1 className="text-4xl font-bold text-navy-800 mb-4">
              Your Recommended Career Path
            </h1>
            <p className="text-xl text-slate-600 mb-2">
              Welcome, {studentData.fullName || 'Future Pharmacist'}!
            </p>
            <p className="text-lg text-slate-600">
              Based on your pharmaceutical profile, I've identified comprehensive career opportunities
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8 animate-scale-in">
            <Card className="bg-gradient-to-r from-navy-500 to-navy-600 text-white text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-2">{careerPaths.length}</div>
                <div className="text-navy-100">Career Matches</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-green-100">Best Match Score</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-autumn-500 to-autumn-600 text-white text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-2">{skillGaps.length}</div>
                <div className="text-autumn-100">Skills to Learn</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-2">450+</div>
                <div className="text-purple-100">Jobs Available</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comprehensive Career Path Recommendations */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-autumn-500" />
            Comprehensive PharmD Career Opportunities
          </h2>
          
          {Object.entries(groupedPaths).map(([category, paths]) => <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-navy-700 mb-4">{category}</h3>
              <div className="space-y-4">
                {paths.map((path, index) => <Card key={index} className="bg-white border-slate-200 hover:border-navy-300 transition-all duration-300 group hover:shadow-lg rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-3">
                            <h4 className="text-lg font-bold text-navy-800 mr-3">{path.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Progress value={path.compatibility} className="w-20 h-2" />
                              <span className="text-sm font-medium text-autumn-600">{path.compatibility}% match</span>
                            </div>
                          </div>
                          
                          <p className="text-slate-600 mb-3">{path.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-slate-500">Key Skills: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {path.skills.map((skill, idx) => <Badge key={idx} variant="secondary" className="bg-navy-100 text-navy-700 text-xs">
                                    {skill}
                                  </Badge>)}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div><span className="text-slate-500">Growth:</span> <span className="text-green-600 font-medium">{path.growth}</span></div>
                              <div><span className="text-slate-500">Salary:</span> <span className="text-navy-700 font-medium">{path.salaryRange}</span></div>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <span className="text-slate-500">Organizations: </span>
                            <span className="text-slate-700">{path.companies.join(', ')}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 lg:ml-6">
                          <Button className="bg-gradient-to-r from-navy-600 to-autumn-500 hover:from-navy-700 hover:to-autumn-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => navigate('/job-scan', {
                      state: {
                        careerPath: path.title,
                        studentData
                      }
                    })}>
                            Find Jobs
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>)}
        </div>

        {/* Skills Gap Analysis */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-autumn-500" />
            Skills to Develop for Pharmaceutical Career Growth
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {skillGaps.map((gap, index) => <Card key={index} className="bg-white border-slate-200 hover:border-navy-300 transition-all duration-300 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-navy-800">{gap.skill}</h3>
                      <span className="text-sm text-slate-500">{gap.category}</span>
                    </div>
                    <Badge variant={gap.priority === 'High' ? 'destructive' : gap.priority === 'Medium' ? 'default' : 'secondary'} className={gap.priority === 'High' ? 'bg-red-100 text-red-700' : gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}>
                      {gap.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Estimated learning time: <span className="text-autumn-600 font-medium">{gap.timeToLearn}</span>
                  </p>
                  <Button variant="outline" size="sm" className="border-navy-200 text-navy-700 hover:bg-navy-50 w-full rounded-lg">
                    Find Learning Resources
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Next Steps CTA */}
        <div className="max-w-6xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-navy-600 to-autumn-500 border-0 shadow-2xl rounded-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Pharmaceutical Career Journey?</h2>
              <p className="text-white/90 mb-6">
                Let Zane AI scan the market for live pharmaceutical opportunities that match your profile
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-navy-700 hover:bg-slate-100 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => navigate('/job-scan', {
                state: {
                  studentData
                }
              })}>
                  Scan Job Market
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/advisory-report', {
                state: {
                  studentData
                }
              })} className="border-2 border-white/30 hover:bg-white/10 px-8 rounded-xl text-zinc-950">
                  Get Advisory Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Logo */}
        <div className="text-center mt-16 pb-8">
          <div className="flex items-center justify-center space-x-3 text-slate-400">
            <div className="w-6 h-6 bg-gradient-to-r from-navy-400 to-autumn-400 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm">Powered by ZaneProEd</span>
          </div>
        </div>
      </div>
    </div>;
};
export default Analysis;