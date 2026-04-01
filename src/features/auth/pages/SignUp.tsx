/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../api/auth";
import { validateEmail, validatePassword } from "../utils/validation";
import { AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import heroImage from "../../../assets/signup.webp";
import blurImage from "../../../assets/signup-blur.jpg";
import toast from "react-hot-toast";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const isSubmitting = useRef(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError(null);
  };

  // Handle blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Validate a single field
  const validateField = (fieldName: string, value: string) => {
    let error = null;

    switch (fieldName) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error || "" }));
    return !error;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    const newErrors = {
      email: emailError || "",
      password: passwordError || "",
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting.current) return;

    if (!validateForm()) {
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);
    setServerError(null);

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
      });

      // Success toast
      toast.success("Account created successfully! 🎉", {
        duration: 5000,
        position: "bottom-right",
        icon: "🎉",
      });

      // Navigate to sign in after delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err: any) {
      let errorMessage = "Failed to create account. Please try again.";

      if (err.message?.includes("User already registered")) {
        errorMessage =
          "An account with this email already exists. Please sign in.";
      } else if (
        err.message?.includes("Password should be at least 6 characters")
      ) {
        errorMessage = "Password must be at least 6 characters.";
      } else if (err.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address before signing in.";
      }

      // Error toast
      toast.error(errorMessage, {
        duration: 5000,
        position: "bottom-right",
      });

      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setServerError(null);

    try {
      await signInWithGoogle();

      // Success toast for Google signup
      toast.success("Successfully signed up with Google!", {
        duration: 4000,
        position: "top-right",
      });

      // Navigate after toast
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to sign up with Google. Please try again.";

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-right",
      });

      setServerError(errorMessage);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="grid grid-cols-2">
      <div className="relative">
        {/* Blur placeholder */}
        <img src={blurImage} className="w-full h-screen object-cover" alt="" />

        {/* Full image */}
        <img
          src={heroImage}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-screen object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          alt="Furniture hero background"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Left Column - Form */}
      <div className="bg-white p-4 lg:py-8 lg:px-20">
        <div className="w-full max-w-md space-y-8 mb-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center">
              <span className="text-white font-serif text-xl">F</span>
            </div>
            <span className="text-2xl tracking-widest font-light">FSJ</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl tracking-wide font-light">
              Create account
            </h1>
            <p className="text-neutral-600">Sign up to get started with FSJ</p>
          </div>
        </div>

        {/* Error Message - Keep for form validation errors, but toast will also show */}
        {serverError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm tracking-wide mb-2 font-semibold"
            >
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  touched.email && errors.email
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                } placeholder-gray-400 focus:outline-none transition-colors`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
            {touched.email && errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm tracking-wide mb-2 font-semibold"
              >
                PASSWORD
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full pl-10 pr-10 py-3 border ${
                  touched.password && errors.password
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                } transition-colors`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-4 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="px-4 flex items-center mx-auto justify-center gap-2 py-3 border border-neutral-300 text-sm tracking-wide hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed duration-200 w-full"
          >
            Continue with Google
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium hover:underline text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
