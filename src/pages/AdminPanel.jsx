import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") return navigate("/dashboard");
      setUser(payload);

      // Fetch users and usage history
      const fetchData = async () => {
        try {
          const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(userRes.data);

          const usageRes = await axios.get(`${import.meta.env.VITE_API_URL}/admin/usage`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsage(usageRes.data);
        } catch (err) {
          console.error("Admin fetch error:", err);
        }
      };

      fetchData();
    } catch {
      navigate("/");
    }
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-teal-700">Admin Dashboard</h1>
      <p className="mb-4 text-2xl text-teal-700">Welcome, {user?.email}</p>
      <p className="mb-6 text-xl text-slate-800" >Here you can manage users and monitor upload/download history.</p>

      {/* User Management */}
      <h2 className="text-xl font-semibold mb-3">👥 Registered Users</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead className="bg-teal-400">
            <tr>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload/Download History */}
      <h2 className="text-xl font-semibold mb-3">📊 Upload & Download History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead className="bg-teal-400">
            <tr>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Chart Type</th>
              <th className="py-2 px-4 text-left">Format</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 px-4">{entry.userEmail}</td>
                <td className="py-2 px-4 capitalize">{entry.type}</td>
                <td className="py-2 px-4">{entry.chartType}</td>
                <td className="py-2 px-4">{entry.format?.toUpperCase()}</td>
                <td className="py-2 px-4 text-sm text-gray-600">{new Date(entry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
