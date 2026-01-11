import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    // Agar loading khatam ho gayi aur user nahi mila, to login par bhejo
    if (!loading && !user) {
      navigate("/login");
    }
    setLoader(false);
  }, [user, loading, navigate]);

  // Jab tak check kar rahe hain, loading dikhao
  if (loading || loader) return <div className="text-white text-center mt-20">Checking Access...</div>;

  // Agar user hai, to andar ka page (Dashboard) dikhao
  return user ? <Outlet /> : null; 
}