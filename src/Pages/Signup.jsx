import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom"
import logo from "../assets/setulogo.png";
import placeholder from "../assets/logofinal.png";
import infoVideo from "../assets/infograpahic.mp4";

// Error messages mapping for better UX
const ERROR_MESSAGES = {
  "auth/email-already-in-use": "This email is already registered",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/operation-not-allowed": "Email/password accounts are not enabled",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/network-request-failed": "Network error. Please check your connection",
  "auth/popup-closed-by-user": "Sign up was cancelled",
  "auth/too-many-requests": "Too many attempts. Please try again later",
  default: "An error occurred. Please try again"
};

const getErrorMessage = (error) => {
  if (!error) return "";
  const code = error.code || "";
  return ERROR_MESSAGES[code] || error.message || ERROR_MESSAGES.default;
};

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: "", color: "" };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  if (strength <= 2) return { strength: 1, label: "Weak", color: "bg-red-500" };
  if (strength <= 3) return { strength: 2, label: "Fair", color: "bg-yellow-500" };
  if (strength <= 4) return { strength: 3, label: "Good", color: "bg-blue-500" };
  return { strength: 4, label: "Strong", color: "bg-green-500" };
};

export default function Signup() {
  const { signup, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const nav = useNavigate();

  const passwordStrength = getPasswordStrength(formData.password);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    // Name validation (if provided)
    if (name && name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }

    // Email validation
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password.length < 8) {
      setError("We recommend using at least 8 characters for better security");
      return false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setError("Please confirm your password");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Terms acceptance
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions");
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
      await signup(
        formData.email.trim(),
        formData.password,
        formData.name.trim() || undefined
      );
      nav("/profile", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      nav("/profile", { replace: true });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9F8F3] dark:bg-[#0B0B0B] transition-colors duration-300">
      {/* Left Image Section */}
      {/* Left Section (Image/Video) */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        {/* Placeholder Image */}
        <img
          src={placeholder}
          alt="Signup background"
          className="absolute inset-0 w-full h-full object-cover brightness-95 dark:brightness-75 z-0"
          loading="lazy"
        />

        <video
          src={infoVideo}
          className="absolute inset-0 w-full h-full object-cover z-10"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay content */}
        <div className="absolute bottom-6 right-8 z-20 text-white text-right">
          <h3 className="text-2xl font-bold mb-2">Build Your Legacy</h3>
          <p className="text-xs text-white/80 max-w-xs leading-relaxed ml-auto">
            Create your profile, showcase your skills, and find your dream team today.
          </p>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
      </div>

      {/* Right Signup Section - Scrollable */}
      <div className="flex w-full md:w-1/2 bg-white dark:bg-[#121212] overflow-hidden">
        <div className="w-full overflow-y-auto">
          <div className="flex justify-center items-center min-h-full px-6 sm:px-12 py-6">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="flex items-center mb-4">
                <img
                  src={logo}
                  alt="Setu logo"
                  className="w-8 h-auto select-none dark:brightness-110"
                />
              </div>

              <h2 className="text-xl font-semibold text-[#2B2B2B] dark:text-gray-100 mb-1">
                Create your account
              </h2>
              <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mb-4">
                Join us today and start your journey
              </p>

              {/* Error Message */}
              {error && (
                <div
                  className="mb-3 text-xs text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 rounded-lg px-3 py-2 border border-red-200 dark:border-red-800"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-[#3C3C3C] dark:text-gray-300 mb-1"
                  >
                    Full name <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    autoComplete="name"
                    disabled={loading}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 
                      bg-[#FCFCF9] dark:bg-[#1C1C1C] px-3 py-2 text-sm text-[#2B2B2B] 
                      dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-[#D94F04] focus:border-transparent
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-[#3C3C3C] dark:text-gray-300 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
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
                    className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 
                      bg-[#FCFCF9] dark:bg-[#1C1C1C] px-3 py-2 text-sm text-[#2B2B2B] 
                      dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-[#D94F04] focus:border-transparent
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-[#3C3C3C] dark:text-gray-300 mb-1"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 
                        bg-[#FCFCF9] dark:bg-[#1C1C1C] px-3 py-2 pr-10 text-sm text-[#2B2B2B] 
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-1.5">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "bg-gray-200 dark:bg-gray-700"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{passwordStrength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-[#3C3C3C] dark:text-gray-300 mb-1"
                  >
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 
                        bg-[#FCFCF9] dark:bg-[#1C1C1C] px-3 py-2 pr-10 text-sm text-[#2B2B2B] 
                        dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D94F04] focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Passwords do not match
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Match
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={loading}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#D94F04] focus:ring-[#D94F04] disabled:opacity-50"
                  />
                  <label htmlFor="terms" className="text-xs text-[#3C3C3C] dark:text-gray-300 leading-snug">
                    I agree to the{" "}
                    <a href="/terms" className="text-[#D94F04] dark:text-[#E86C2E] hover:underline" target="_blank" rel="noopener noreferrer">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#D94F04] dark:text-[#E86C2E] hover:underline" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </label>
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
                      Creating...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-[#E2E1DB] dark:border-gray-700 w-full" />
                  <span className="absolute bg-white dark:bg-[#121212] px-2 text-xs text-gray-500 dark:text-gray-400">
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
                    transition-all duration-200 flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-[#E2E1DB] dark:focus:ring-gray-600"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </form>

              {/* Login link */}
              <p className="mt-4 text-center text-xs text-[#3C3C3C] dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#D94F04] dark:text-[#E86C2E] hover:underline font-semibold"
                >
                  Log in
                </Link>
              </p>

              {/* Footer */}
              <div className="flex justify-center items-center gap-2 mt-4 mb-6 text-xs text-[#8A877C] dark:text-gray-400">
                <img src={logo} alt="Setu logo" className="w-3 h-auto" />
                <span>© Setu App 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}