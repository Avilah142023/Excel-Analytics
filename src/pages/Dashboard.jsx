import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Bar,
  Line,
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      navigate("/");
    }
  }, []);

  useEffect(() => {
  const fetchDownloads = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/charts/user-downloads`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setDownloads(data);
    } catch (err) {
      console.error("Error fetching downloads", err);
    }
  };

  fetchDownloads();
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadResult(data);
        setXAxis(data.columns[0]);
        setYAxis(data.columns[1]);
        setUploadError(null);
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setUploadError("Server error during upload.");
    }
  };
  
  const chartRef = useRef();

  const chartData = uploadResult?.data?.length
    ? {
        labels: uploadResult.data.map((row) => row[xAxis]),
        datasets: [
          {
            label: yAxis,
            data: uploadResult.data.map((row) => row[yAxis]),
            backgroundColor:
              chartType === "pie"
                ? [
                    "#0F766E",
                    "#0D9488",
                    "#14B8A6",
                    "#2DD4BF",
                    "#5EEAD4",
                    "#99F6E4",
                    "#CCFBF1",
                  ]
                : "#0F766E",
            borderWidth: 1,
          },
        ],
      }
    : null;

 const handleDownload = async (format, chartType, chartRef) => {
  try {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    const canvas = await html2canvas(chartElement);
    const imageData = canvas.toDataURL('image/png');

    const fileName = `${chartType}-chart-${Date.now()}.${format}`;

    // ⬇️ Download chart
    if (format === 'png') {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = fileName;
      link.click();
    } else if (format === 'pdf') {
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    }

    // ✅ Save chart download info to backend
const token = localStorage.getItem('token');
await axios.post(
  `${import.meta.env.VITE_API_URL}/charts/save`,
  {
    chartType,
    format,
    fileName,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    console.log('Download and save successful');
  } catch (error) {
    console.error('Error during download or saving:', error);
  }
};


  const renderChart = () => {
    if (!chartData) return null;

    const chartProps = {
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales:
          chartType !== "pie"
            ? {
                y: {
                  beginAtZero: true,
                  ticks: { color: "##115E59" },
                },
                x: {
                  ticks: { color: "##115E59" },
                },
              }
            : {},
      },
    };

    switch (chartType) {
      case "line":
        return <Line {...chartProps} />;
      case "pie":
        return <Pie {...chartProps} />;
      case "bar":
      default:
        return <Bar {...chartProps} />;
    }
  };



  return (
  <div className="flex min-h-screen bg-gray-100 text-gray-800">
    {/* Sidebar */}
    <aside className="w-64 bg-white shadow-md border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-lg text-teal-700 font-bold">
<img src="/logo.png" alt="Logo" className="w-8 h-8" />Excel Analytics
</div>
        <nav className="mt-4 space-y-1 px-4 text-sm">
          <a href="#" className="block py-2 px-3 rounded text-teal-700 font-semibold bg-blue-50">Dashboard</a>
          <Link to="/downloads" className="block py-2 px-3 rounded hover:bg-teal-500"></Link>
        </nav>

        {user?.role === 'admin' && (
          <Link to="/admin" className="block py-2 px-3 rounded hover:bg-teal-500">
            Admin Panel
          </Link>
        )}
      </div>
      <div className="p-4 border-t text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <img src="https://i.pravatar.cc/40" className="rounded-full" />
          <div>
            <p className="font-medium">{user?.email || "User"}</p>
            <p className="text-xs">{user?.role || "Analyst"}</p>
          </div>
        </div>
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-teal-700">Welcome to Excel Analytics</h1>
          <p className="text-sm text-gray-500">Your interactive Excel visualization workspace</p>
        </div>
        <button onClick={handleLogout} className="text-sm bg-gray-200 px-4 py-2 rounded hover:bg-teal-500">
          Logout
        </button>
      </div>

      {/* Upload Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold mb-4">📤 Upload Excel File</h2>
        <label
          htmlFor="file-upload"
          className="block cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-lg hover:bg-gray-100 transition"
        >
          <p className="text-sm mb-1">Click or drag your `.xls` or `.xlsx` file</p>
          <input
            id="file-upload"
            type="file"
            accept=".xls,.xlsx"
            className="hidden"
            onChange={handleExcelUpload}
          />
        </label>
        {uploadError && <p className="text-red-600 mt-4">{uploadError}</p>}
      </div>

      {/* Chart + Controls */}
      {uploadResult?.data?.length > 0 && (
        <>
          {/* Dropdowns */}
          <div className="mt-10 flex flex-wrap gap-6 items-end">
            <div>
              <label className="text-sm block mb-1">X-Axis</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="border rounded px-4 py-2 bg-white shadow-sm"
              >
                {uploadResult.columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1">Y-Axis</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="border rounded px-4 py-2 bg-white shadow-sm"
              >
                {uploadResult.columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border rounded px-4 py-2 bg-white shadow-sm"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
              </select>
            </div>
          </div>


         {/* Chart Preview (wrap with ref) */}
          <div ref={chartRef} className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">📈 Chart Preview</h3>
            {renderChart()}
          </div>
           
          {/* Download Buttons */}
          <div className="flex gap-4 mt-8">
  <button
    onClick={() => handleDownload('pdf', chartType, chartRef)}
    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-emerald-800"
  >
    Download PDF
  </button>
  <button
    onClick={() => handleDownload('png', chartType, chartRef)}
    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-emerald-400"
  >
    Download PNG
  </button>
</div>

         <h2 className="text-xl font-bold mt-6 text-gray-800">Download History</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
  {downloads.map((d, i) => (
    
    <div
      key={i}
      className="bg-teal-200 p-4 rounded-xl shadow-md border border-teal-300 
                 hover:scale-105 transform transition-transform duration-300 "
                 
    >
      <p className="text-black font-semibold">Type: {d.chartType}</p>
     {d.chartData ? (
  <img src={d.chartData} alt={`Chart ${i + 1}`} />
) : (
  <p>Chart {i + 1}</p>
)}

    </div>
  ))}
</div>



          {/* Table Preview */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">📊 Data Table (Top 10 rows)</h3>
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {uploadResult.columns.map((col, idx) => (
                      <th key={idx} className="px-4 py-2 border">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadResult.data.slice(0, 10).map((row, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                      {uploadResult.columns.map((col, idx) => (
                        <td key={idx} className="px-4 py-2 border">{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  </div>
);
}
