import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { api } from "@/services/api";
import { ROUTES } from "@/config/routes";
import loginSvg from "@/assets/login.svg";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = "/api/v1/users/auth/google";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.login(email, password);
      // Redirect to dashboard on success - use window.location for full page reload
      console.log("Login successful, redirecting to:", ROUTES.DASHBOARD);
      window.location.href = ROUTES.DASHBOARD;
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Gradient Background with Login Form */}
      <div
        className="flex-[0.35] flex flex-col justify-center items-center px-8 lg:px-16 min-h-screen lg:min-h-auto"
        style={{
          background: "linear-gradient(to right, #EC85CA, #3351FD)",
          borderRadius: "0 50px 50px 0",
        }}
      >
        {/* Welcome Section */}
        <div className="mb-8 lg:mb-12 text-left">
          <h1
            className="text-white mb-2 lg:mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 64px)",
            }}
          >
            Welcome!
          </h1>
          <p
            className="text-white"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "48px",
            }}
          >
            Ready to get started?
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 md:p-8">
          {/* Title */}
          <h2
            className="text-black mb-4 sm:mb-6"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "clamp(24px, 5vw, 36px)",
            }}
          >
            Log In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <Icon icon="mingcute:alert-line" width={20} height={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-black mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px",
                }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="Enter your email"
                disabled={isLoading}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000000",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-black mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="Enter your password"
                disabled={isLoading}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000000",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(to right, #6A94EE, #916BE3)",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "22px",
                borderRadius: "15px",
              }}
            >
              {isLoading ? (
                <>
                  <Icon
                    icon="mingcute:loading-line"
                    width={20}
                    height={20}
                    className="animate-spin"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                "LOG IN"
              )}
            </button>
            <button
              type="button"
              onClick={() => window.location.href = ROUTES.FORGOT_PASSWORD}
              className="w-full text-purple-600 hover:text-purple-700 font-semibold hover:underline text-center py-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Reset Password
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="bg-white px-4 text-gray-500"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full text-white py-3 font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-300 rounded-lg"
              style={{
                background: "#fff",
                color: "#4285F4",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
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
              Continue with Google
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p
              className="text-gray-600"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Don't have an account?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - SVG Illustration */}
      <div className="flex-[0.65] bg-white flex items-center justify-center p-8 hidden lg:flex">
        <img
          src={loginSvg}
          alt="Login Illustration"
          className="w-2/3 h-auto object-contain"
        />
      </div>
    </div>
  );
}
