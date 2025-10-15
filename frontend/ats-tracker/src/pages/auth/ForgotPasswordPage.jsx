import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import "./AuthPage.css";

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPasswordPage = () => {
  const { forgotPassword, error, setError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    const result = await forgotPassword(data.email);

    if (result.success) {
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="success-container">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h1>Check Your Email</h1>
            <p>
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions to reset your
              password.
            </p>
            <p className="text-muted">
              Didn't receive the email? Check your spam folder or try again in a
              few minutes.
            </p>
            <div className="success-actions">
              <Link to="/login" className="btn btn-primary">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setError(null);
                }}
                className="btn btn-outline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Forgot Password?</h1>
          <p>
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={errors.email ? "error" : ""}
              />
            </div>
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
