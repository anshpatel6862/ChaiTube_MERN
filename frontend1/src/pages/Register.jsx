import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance"; // Aapka banaya hua axios setup

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    avatar: null,      // Image file ke liye
    coverImage: null,  // Image file ke liye
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Text inputs (Name, Email, etc.) handle karne ke liye
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File inputs (Images) handle karne ke liye
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    // File select hone par hi state update karein
    if (files && files[0]) {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Data ko FormData object mein convert karna padega (Images bhejne ke liye zaroori hai)
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("avatar", formData.avatar); // Required in backend
    
    if (formData.coverImage) {
      data.append("coverImage", formData.coverImage);
    }

    try {
      // 2. Backend call (/api/v2/users/register)
      // 'Content-Type' header lagana zaroori hai multipart/form-data ke liye
      await api.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert("Registration Successful! Please Login.");
      navigate("/login"); // User ko Login page par bhej do

    } catch (err) {
      console.log("Register Error:", err);
      // Backend se jo error msg aaye wo dikhao, ya default msg
      setError(err.response?.data?.message || "Registration Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
            onChange={handleChange}
            required
          />
          
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
            onChange={handleChange}
            required
          />
          
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
            onChange={handleChange}
            required
          />
          
          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
            onChange={handleChange}
            required
          />

          {/* Avatar Upload (Zaroori hai) */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Avatar (Required)</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Cover Image Upload (Optional) */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Cover Image (Optional)</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-600 file:text-white hover:file:bg-gray-700 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;