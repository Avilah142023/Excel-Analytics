import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [secretKey, setSecretKey] = useState(""); // for admin registration
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(""); // clear error

    const body = { name, email, password, role };

    if (role === "admin") {
      body.secretKey = secretKey;
    }

    const res = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, password, confirmPassword, role, secretKey }),
});


    const data = await res.json();

    if (res.status === 401 && role === "admin") {
      alert("Unauthorized admin registration. Secret key invalid.");
      return;
    }

    if (data.token) {
      alert("Registration successful! Please sign in.");
      navigate("/login");
    } else {
      setError(data.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold text-teal-700">
<img src="/logo.png" alt="Logo" className="w-8 h-8" />Excel Analysis</div>
          <p className="text-gray-500 text-sm mt-1">Create your free account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Role Toggle */}
          <div className="flex items-center justify-center mb-4">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-700">Register as Admin</span>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-teal-600"
                checked={role === "admin"}
                onChange={() => setRole(role === "user" ? "admin" : "user")}
              />
            </label>
          </div>

          {/* Admin Secret Key Input */}
          {role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Admin Secret Key</label>
              <input
                type="password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter secret key"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email address</label>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              required
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-teal-700"
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-teal-800 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
