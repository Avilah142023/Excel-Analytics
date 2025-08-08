import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UploadHistory() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/files/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('Failed to fetch upload history.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-teal-700">Uploaded Files</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file._id}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-teal-500"
              >
                <p className="font-semibold text-gray-800">{file.filename}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded on: {new Date(file.uploadDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Type: {file.mimetype}</p>
                <p className="text-sm text-gray-500">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadHistory;
