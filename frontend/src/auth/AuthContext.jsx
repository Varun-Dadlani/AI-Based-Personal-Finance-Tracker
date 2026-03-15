import { createContext, useEffect, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      await api.get("/auth/me");
      setAuthenticated(true);
    } catch (err) {
      localStorage.removeItem("token");
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
