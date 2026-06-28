"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  // Handle password reset callback
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      // User clicked password reset link
      router.push('/login?reset=true');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (showForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login?reset=true`,
        });
        if (error) {
          setError(error.message);
        } else {
          setMessage("Check your email for password reset instructions!");
        }
      } else if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
            setError("Network error: Check your internet connection and Supabase configuration");
          } else {
            setError(error.message);
          }
        } else {
          setMessage("Check your email to confirm your account!");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
            setError("Network error: Check your internet connection and Supabase configuration");
          } else {
            setError(error.message);
          }
        } else {
          router.push("/today");
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.message?.includes('fetch') || err?.message?.includes('network') || err?.message?.includes('Failed to fetch')) {
        setError("Network error: Unable to connect to Supabase. Please check your configuration.");
      } else {
        setError(err?.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9DC1A5] to-[#79A98C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 ">
            <span className="text-4xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Health Tracker</h1>
          <p className="text-white/80">Your wellness companion</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl  p-8">
          <h2 className="text-2xl font-bold text-[#1B1714] text-center mb-6">
            {showForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8A7F78] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#F0E9CE] focus:border-[#79A98C] focus:ring-2 focus:ring-[#79A98C]/20 outline-none transition text-[#1B1714]"
                placeholder="you@example.com"
                required
              />
            </div>

            {!showForgotPassword && (
              <div>
                <label className="block text-sm font-medium text-[#8A7F78] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#F0E9CE] focus:border-[#79A98C] focus:ring-2 focus:ring-[#79A98C]/20 outline-none transition text-[#1B1714]"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            {error && (
              <div className="bg-[#9DC1A5]/10 text-[#8A7F78] px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-[#3E7E57]/10 text-[#3E7E57] px-4 py-3 rounded-xl text-sm border border-[#3E7E57]/20">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#79A98C] hover:bg-[#5E8C6E] text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : showForgotPassword ? (
                "Send Reset Link"
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            {!showForgotPassword && !isSignUp && (
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setError("");
                  setMessage("");
                }}
                className="block w-full text-[#79A98C] hover:text-[#5E8C6E] font-medium transition text-sm"
              >
                Forgot password?
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setShowForgotPassword(false);
                setError("");
                setMessage("");
              }}
              className="text-[#79A98C] hover:text-[#5E8C6E] font-medium transition text-sm"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : showForgotPassword
                ? "Back to sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Your data is securely stored and private
        </p>
      </div>
    </div>
  );
}
