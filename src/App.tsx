
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentAuthProvider } from "@/contexts/StudentAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Intake from "./pages/Intake";
import Analysis from "./pages/Analysis";
import JobScan from "./pages/JobScan";
import JobApplication from "./pages/JobApplication";
import JobDetails from "./pages/JobDetails";
import AdvisoryReport from "./pages/AdvisoryReport";
import CoursesPage from "./pages/CoursesPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StudentAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/intake" element={
              <ProtectedRoute>
                <Intake />
              </ProtectedRoute>
            } />
            <Route path="/analysis" element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            } />
            <Route path="/job-scan" element={
              <ProtectedRoute>
                <JobScan />
              </ProtectedRoute>
            } />
            <Route path="/job-application/:jobId" element={
              <ProtectedRoute>
                <JobApplication />
              </ProtectedRoute>
            } />
            <Route path="/job-details/:jobId" element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            } />
            <Route path="/advisory-report" element={
              <ProtectedRoute>
                <AdvisoryReport />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            } />
            <Route path="/recruiter-dashboard" element={
              <ProtectedRoute>
                <RecruiterDashboard />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StudentAuthProvider>
  </QueryClientProvider>
);

export default App;
