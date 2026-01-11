import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance"; // Aapka banaya hua axios setup
import { useAuth } from "../context/AuthContext"; // User state update karne ke liye

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth(); // Context se functions le rahe hain

  const [formData, setFormData] = useState({
    email: "",
    password: "", // Hitesh sir ke backend me username se bhi login hota hai, par abhi email rakhte hain
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Backend Route: POST /api/v2/users/login
      const res = await api.post("/users/login", {
        email: formData.email,
        password: formData.password
      });

      // Backend response structure: res.data.data -> { user, accessToken, refreshToken }
      const { user, accessToken, refreshToken } = res.data.data;

      // 1. Tokens ko LocalStorage mein save karein
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 2. Context aur State update karein
      setToken(accessToken);
      setUser(user);

      // 3. User ko Home page par redirect karein
      // alert("Login Successful!"); // Optional: Agar popup nahi dikhana to hata dein
      navigate("/"); 

    } catch (err) {
      console.log("Login Error:", err);
      // Backend error message dikhayein
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;