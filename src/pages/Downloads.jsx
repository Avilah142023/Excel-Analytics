import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/charts/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDownloads(res.data);
      } catch (error) {
        console.error("Error fetching downloads:", error);
      } finally {
        setLoading(false); // ✅ this line is essential
      }
    };

    fetchDownloads();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Your Downloads</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : downloads.length === 0 ? (
        <p className="text-gray-600">No downloads found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloads.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p className="font-semibold text-teal-700 capitalize">Chart Type: {item.chartType}</p>
              <p className="text-gray-700">Format: {item.format.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mb-2">File: {item.fileName}</p>
              {/* Optional: Add download link */}
              {/* <a href={`/api/charts/download/${item.fileName}`} download className="text-blue-500 underline">Download Again</a> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
