import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async ({ email, username, password }) => {
    try {
      setLoading(true);

      const data = await register({
        email,
        username,
        password,
      });

      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, username, password }) => {
    try {
      setLoading(true);

      const data = await login({
        email,
        username,
        password,
      });

      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    try {
      setLoading(true);

      const data = await getMe();

      setUser(data.user);

      return data;
    } catch (error) {
      // User logged in nahi hai
      setUser(null);

      console.log("Get Me:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLouOut = async () => {
    try {
      setLoading(true);

      const data = await logout();

      setUser(null);

      return data;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMe();
  }, []);

  return {
    loading,
    user,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLouOut,
  };
};
