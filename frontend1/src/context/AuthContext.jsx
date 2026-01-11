import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else setLoading(false);
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/api/v2/users/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.data?.user) setUser(data.data.user);
    } catch (err) {
      console.log("Fetch user failed", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
