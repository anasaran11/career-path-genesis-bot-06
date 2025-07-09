import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  username: string;
  full_name: string;
  email: string;
  institution: string;
  credits: number;
  profile_completed?: boolean;
}

interface StudentAuthContextType {
  student: Student | null;
  loading: boolean;
  signIn: (
    username: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => void;
  checkProfileCompletion: (studentId: string) => Promise<boolean>;
  markProfileCompleted: (studentId: string) => void;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(
  undefined,
);

export const StudentAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if student is already logged in (from localStorage)
    const storedStudent = localStorage.getItem("zane_student");
    if (storedStudent) {
      try {
        const parsedStudent = JSON.parse(storedStudent);
        setStudent(parsedStudent);
      } catch (error) {
        console.error("Error parsing stored student data:", error);
        localStorage.removeItem("zane_student");
      }
    }
    setLoading(false);
  }, []);

  const checkProfileCompletion = async (
    studentId: string,
  ): Promise<boolean> => {
    try {
      // Check if profile data exists in localStorage (from intake)
      const profileData = localStorage.getItem(`student_profile_${studentId}`);
      if (profileData) {
        return true;
      }

      // Check if profile exists in database
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", studentId)
        .single();

      return !!profile;
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }
  };

  const markProfileCompleted = (studentId: string) => {
    if (student && student.id === studentId) {
      const updatedStudent = { ...student, profile_completed: true };
      setStudent(updatedStudent);
      localStorage.setItem("zane_student", JSON.stringify(updatedStudent));
    }
  };

  const signIn = async (
    username: string,
    password: string,
  ): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.rpc("verify_login", {
        input_username: username,
        input_password: password,
      });

      if (error) {
        return { error: error.message };
      }

      // Parse the JSON response
      const result = typeof data === "string" ? JSON.parse(data) : data;

      if (result.error) {
        return { error: result.error };
      }

      if (result.success && result.student) {
        const studentData = result.student;

        // Check profile completion status
        const profileCompleted = await checkProfileCompletion(studentData.id);
        const studentWithCompletion = {
          ...studentData,
          profile_completed: profileCompleted,
        };

        setStudent(studentWithCompletion);
        localStorage.setItem(
          "zane_student",
          JSON.stringify(studentWithCompletion),
        );

        toast({
          title: "Welcome back!",
          description: `Signed in as ${studentData.full_name}`,
        });

        return { error: null };
      }

      return { error: "Invalid response from server" };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: "An error occurred during sign in" };
    }
  };

  const signOut = () => {
    setStudent(null);
    localStorage.removeItem("zane_student");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  return (
    <StudentAuthContext.Provider
      value={{
        student,
        loading,
        signIn,
        signOut,
        checkProfileCompletion,
        markProfileCompleted,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error("useStudentAuth must be used within a StudentAuthProvider");
  }
  return context;
};
