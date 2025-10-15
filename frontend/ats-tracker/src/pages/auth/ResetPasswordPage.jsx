import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import "./AuthPage.css";

const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { resetPassword, error, setError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return "#ef4444";
    if (strength < 50) return "#f59e0b";
    if (strength < 75) return "#3b82f6";
    return "#10b981";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const onSubmit = async (data) => {
    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { confirmPassword, ...resetData } = data;
    const result = await resetPassword(token, resetData.password);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
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
            <h1>Password Reset Successful!</h1>
            <p>
              Your password has been successfully reset. You are now logged in
              and will be redirected to your dashboard.
            </p>
            <div className="success-actions">
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
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
          <h1>Reset Your Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                {...register("password")}
                className={errors.password ? "error" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor:
                        getPasswordStrengthColor(passwordStrength),
                    }}
                  />
                </div>
                <span
                  className="strength-text"
                  style={{ color: getPasswordStrengthColor(passwordStrength) }}
                >
                  {getPasswordStrengthText(passwordStrength)}
                </span>
              </div>
            )}

            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "error" : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={password.length >= 8 ? "valid" : ""}>
                <CheckCircle size={16} />
                At least 8 characters
              </li>
              <li className={/[a-z]/.test(password) ? "valid" : ""}>
                <CheckCircle size={16} />
                One lowercase letter
              </li>
              <li className={/[A-Z]/.test(password) ? "valid" : ""}>
                <CheckCircle size={16} />
                One uppercase letter
              </li>
              <li className={/\d/.test(password) ? "valid" : ""}>
                <CheckCircle size={16} />
                One number
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPasswordPage;
