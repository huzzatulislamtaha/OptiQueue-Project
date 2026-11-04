import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "optiqueue_admin_token";
const USER_KEY = "optiqueue_admin_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  // Check saved login session
  async function restoreSession() {
    try {
      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);

      if (!savedToken) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success || data.user?.role !== "admin") {
        await clearSession();
        return;
      }

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

      setToken(savedToken);
      setUser(data.user);
    } catch (error) {
      console.error("Session restore error:", error);
      await clearSession();
    } finally {
      setLoading(false);
    }
  }

  // Admin login
  async function login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.user?.role !== "admin") {
        throw new Error("Admin account required.");
      }

      if (!data.token) {
        throw new Error("Authentication token not received.");
      }

      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Cannot connect to backend server.");
      }

      throw error;
    }
  }

  // Clear saved session
  async function clearSession() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

    setToken(null);
    setUser(null);
  }

  // Admin logout
  async function logout() {
    await clearSession();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}