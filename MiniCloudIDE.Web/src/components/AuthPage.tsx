import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";

const AuthPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Accessing login and register functions from AuthContext using custom hook.
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err: any) {
      const data = err.response?.data;
      let msg: string;
      if (typeof data === "string") {
        msg = data;
      } else if (Array.isArray(data?.errors)) {
        msg = data.errors.join(" ");
      } else {
        msg = data?.message || data?.error || data?.title || "An error occurred";
      }
      setError(msg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>MiniCloud IDE</h1>
        {onBack && (
          <button onClick={onBack} style={{ ...styles.tab, marginBottom: "12px", textAlign: "center", display: "block", width: "100%" }}>
            ← Back to Editor
          </button>
        )}
        <div style={styles.tabs}>
          <button
            style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Login
          </button>
          <button
            style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{String(error)}</p>}
          <button type="submit" style={styles.submitBtn}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#1e1e1e",
  },
  card: {
    background: "#2d2d2d",
    borderRadius: "12px",
    padding: "40px",
    width: "380px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "24px",
  },
  tabs: {
    display: "flex",
    gap: "0",
    marginBottom: "20px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #444",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    color: "#aaa",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeTab: {
    flex: 1,
    padding: "10px",
    background: "#0078d4",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#3c3c3c",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  submitBtn: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#0078d4",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },
  error: {
    color: "#ff6b6b",
    margin: "0",
    fontSize: "13px",
    textAlign: "center",
  },
};

export default AuthPage;
