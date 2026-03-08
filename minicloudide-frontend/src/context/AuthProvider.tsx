import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

// Shortcut hook to use the AuthContext in components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("/Auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post("/Auth/login", { email, password });
    const jwt = res.data.token;
    localStorage.setItem("token", jwt);
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    setToken(jwt);
    const meRes = await axios.get("/Auth/me");
    setUser(meRes.data);
    setShowAuth(false);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await axios.post("/Auth/register", { username, email, password });
    const jwt = res.data.token;
    localStorage.setItem("token", jwt);
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    setToken(jwt);
    const meRes = await axios.get("/Auth/me");
    setUser(meRes.data);
    setShowAuth(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, showAuth, setShowAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
