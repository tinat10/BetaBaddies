import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get("/users/me");
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      setUser(userData);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post("/auth/register", userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem("token", token);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await api.post("/auth/forgot-password", { email });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password reset request failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      const response = await api.post("/auth/reset-password", {
        token,
        password: newPassword,
      });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password reset failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.put("/users/me", profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteAccount = async (password) => {
    try {
      setError(null);
      await api.delete("/users/me", { data: { password } });
      localStorage.removeItem("token");
      setUser(null);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Account deletion failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    deleteAccount,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
