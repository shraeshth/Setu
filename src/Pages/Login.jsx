import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logofinal.png";
import placeholder from "../assets/logofinal.png";

// Error messages mapping for better UX
const ERROR_MESSAGES = {
  "auth/invalid-email": "Please enter a valid email address",
  "auth/user-disabled": "This account has been disabled",
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/too-many-requests": "Too many failed attempts. Please try again later",
  "auth/network-request-failed": "Network error. Please check your connection",
  "auth/popup-closed-by-user": "Sign in was cancelled",
  default: "An error occurred. Please try again"
};

const getErrorMessage = (error) => {
  if (!error) return "";
  const code = error.code || "";
  return ERROR_MESSAGES[code] || error.message || ERROR_MESSAGES.default;
};

export default function Login() {
  const { login, signInWithGoogle, sendResetEmail } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear reset email notification
  useEffect(() => {
    if (resetEmailSent) {
      const timer = setTimeout(() => setResetEmailSent(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [resetEmailSent]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  const validateForm = () => {
    const { email, password } = formData;
    
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password) {
      setError("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError("");
    setLoading(true);
    
    try {
      await login(formData.email.trim(), formData.password);
      nav("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      nav("/home", { replace: true });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const email = formData.email.trim();
    
    if (!email) {
      setError("Please enter your email address to reset password");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await sendResetEmail(email);
      setResetEmailSent(true);
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (err) {
      console.error("Password reset error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9F8F3] dark:bg-[#0B0B0B] transition-colors duration-300">
      {/* Left Image Section */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src={placeholder}
          alt="Login background"
          className="w-full h-full object-cover rounded-r-3xl brightness-95 dark:brightness-75"
          loading="lazy"
        />
        <p className="absolute bottom-4 left-6 text-xs text-white/80">
          Photo by Unsplash
        </p>
      </div>

      {/* Right Login Section */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white dark:bg-[#121212] px-8 sm:px-16 py-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <img
              src={logo}
              alt="Setu logo"
              className="w-15 h-auto select-none dark:brightness-110"
            />
          </div>

          <h2 className="text-2xl font-semibold text-[#2B2B2B] dark:text-gray-100 mb-2">
            Nice to see you again
          </h2>
          <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mb-6">
            Welcome back! Please enter your details
          </p>

          {/* Success Message */}
          {resetEmailSent && (
            <div 
              className="mb-4 text-sm text-green-700 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30 rounded-lg px-4 py-3 border border-green-200 dark:border-green-800"
              role="alert"
              aria-live="polite"
            >
              Password reset email sent! Check your inbox.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div 
              className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 rounded-lg px-4 py-3 border border-red-200 dark:border-red-800"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label 
                htmlFor="email"
                className="block text-sm font-medium text-[#3C3C3C] dark:text-gray-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                placeholder="you@example.com"
                aria-describedby={error ? "error-message" : undefined}
                className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 
                  bg-[#FCFCF9] dark:bg-[#1C1C1C] px-3.5 py-2.5 text-sm text-[#2B2B2B] 
                  dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-[#D94F04] focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              />
            </div>

            <div>
              <label 
                htmlFor="password"
                className="block text-sm font-medium text-[#3C3C3C] dark:text-gray-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  aria-describedby={error ? "error-message" : undefined}
                  className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 
                    bg-[#FCFCF9] dark:bg-[#1C1C1C] px-3.5 py-2.5 pr-10 text-sm text-[#2B2B2B] 
                    dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-[#D94F04] focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="text-xs text-[#2E7BE4] hover:text-[#1e5bb8] dark:text-[#4A9EFF] dark:hover:text-[#2E7BE4] hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] 
                dark:hover:bg-[#D94F04] text-white py-2.5 rounded-lg text-sm font-semibold 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-[#D94F04] focus:ring-offset-2
                dark:focus:ring-offset-[#121212]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-[#E2E1DB] dark:border-gray-700 w-full" />
              <span className="absolute bg-white dark:bg-[#121212] px-3 text-xs text-gray-500 dark:text-gray-400">
                OR
              </span>
            </div>

            <button
              onClick={handleGoogle}
              type="button"
              disabled={loading}
              className="w-full border border-[#E2E1DB] dark:border-gray-700 
                py-2.5 rounded-lg text-sm font-semibold text-[#2B2B2B] dark:text-gray-200 
                bg-[#FCFCF9] dark:bg-[#1C1C1C] hover:bg-[#F5F5F2] dark:hover:bg-[#2A2A2A] 
                transition-all duration-200 flex items-center justify-center gap-3
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-[#E2E1DB] dark:focus:ring-gray-600"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-sm text-[#3C3C3C] dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#D94F04] dark:text-[#E86C2E] hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>

          {/* Footer */}
          <div className="flex justify-center items-center gap-2 mt-8 text-xs text-[#8A877C] dark:text-gray-400">
            <img src={logo} alt="Setu logo" className="w-4 h-auto" />
            <span>© Setu App 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}