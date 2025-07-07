"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      switch (error) {
        case "TokenExpired":
          toast.error("Your session has expired. Please sign in again.");
          break;
        case "Unauthorized":
          toast.error("You need to sign in to access this page.");
          break;
        default:
          toast.error("An authentication error occurred. Please try again.");
      }
    }
  }, [error]);

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-cyan-100 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Error</h2>
        
        <p className="text-slate-600 mb-8">
          {error === "TokenExpired" && "Your session has expired. Please sign in again to continue."}
          {error === "Unauthorized" && "You need to be signed in to access this page."}
          {!error && "An authentication error occurred. Please try signing in again."}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
          >
            Sign In
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}