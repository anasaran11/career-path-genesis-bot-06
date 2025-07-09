
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/');
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
          description: error === 'Invalid credentials' ? 'Invalid username or password' : error,
          variant: "destructive",
        });
      } else {
        if (isModal && onClose) {
          onClose();
        } else {
          navigate('/');
        }
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

  const content = (
    <div className={`${isModal ? 'p-0' : 'min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4'}`}>
      <div className={`${isModal ? 'w-full' : 'max-w-md w-full'}`}>
        {!isModal && (
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
        )}

        <Card className={`bg-white border border-slate-200 shadow-xl ${isModal ? 'rounded-lg' : 'rounded-2xl'}`}>
          {isModal && (
            <div className="flex justify-between items-center p-6 pb-0">
              <h2 className="text-xl font-bold text-navy-800">Sign In to Zane AI</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <CardHeader className={isModal ? "px-6 pt-2" : "pb-4"}>
            {!isModal && (
              <div className="flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-navy-600" />
              </div>
            )}
            {!isModal && (
              <>
                <CardTitle className="text-navy-800 text-xl text-center">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your student credentials to continue
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className={isModal ? "px-6 pb-6" : ""}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default SignIn;
