import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Brain, User, X } from "lucide-react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useToast } from "@/hooks/use-toast";

interface SignInProps {
  isModal?: boolean;
  onClose?: () => void;
}

const SignIn: React.FC<SignInProps> = ({ isModal = false, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { signIn, student } = useStudentAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect based on profile completion status
  useEffect(() => {
    if (student) {
      if (isModal && onClose) {
        onClose();
        // Check if profile is completed and navigate accordingly
        if (!student.profile_completed) {
          setTimeout(() => navigate("/intake"), 100);
        } else {
          setTimeout(() => navigate("/analysis"), 100);
        }
      } else {
        // Navigate based on profile completion
        if (!student.profile_completed) {
          navigate("/intake");
        } else {
          navigate("/analysis");
        }
      }
    }
  }, [student, navigate, isModal, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(formData.username, formData.password);

      if (error) {
        toast({
          title: "Sign In Failed",
          description:
            error === "Invalid credentials"
              ? "Invalid username or password"
              : error,
          variant: "destructive",
        });
      }
      // Navigation will be handled by useEffect when student state updates
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const content = (
    <div
      className={`${isModal ? "p-0" : "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4"}`}
    >
      <div className={`${isModal ? "w-full" : "max-w-md w-full"}`}>
        {!isModal && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-autumn-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-navy-800 mb-2">Zane AI</h1>
            <p className="text-slate-600">
              Student Portal - Sign in to access your career insights
            </p>
          </div>
        )}

        <Card className="shadow-xl border border-slate-200">
          <CardHeader className={`${isModal ? "pb-4" : "pb-6"}`}>
            {isModal && (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-navy-600" />
                  <span className="font-bold text-navy-700">Zane AI</span>
                </div>
                {onClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
            <CardTitle
              className={`text-navy-800 ${isModal ? "text-xl" : "text-2xl"}`}
            >
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sign in to your student account to continue your career journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-navy-700 font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="pl-10 bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-navy-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="bg-slate-50 border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white transition-all duration-300 rounded-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-navy-600 to-autumn-500 hover:from-navy-700 hover:to-autumn-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                New to Zane AI? Contact your institution for account access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative z-10 w-full max-w-md mx-4">{content}</div>
      </div>
    );
  }

  return content;
};

export default SignIn;
