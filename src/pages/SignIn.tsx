
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, User } from "lucide-react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { signIn, student } = useStudentAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    if (student) {
      navigate('/');
    }
  }, [student, navigate]);

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
          description: error === 'Invalid credentials' ? 'Invalid username or password' : error,
          variant: "destructive",
        });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-autumn-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-navy-800 mb-2">
            Zane AI
          </h1>
          <p className="text-slate-600">
            Student Portal - Sign in to access your career insights
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="bg-white border border-slate-200 shadow-xl rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-navy-600" />
            </div>
            <CardTitle className="text-navy-800 text-xl text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your student credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-navy-700 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-xl"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-navy-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-slate-50 border-slate-200 text-navy-800 focus:border-navy-400 rounded-xl"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-navy-600 to-autumn-500 hover:from-navy-700 hover:to-autumn-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>Username:</strong> john_doe | <strong>Password:</strong> password123</div>
                <div><strong>Username:</strong> jane_smith | <strong>Password:</strong> mypassword</div>
                <div><strong>Username:</strong> mike_johnson | <strong>Password:</strong> securepass</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
