import { useState } from "react";

export default function Upload() {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/files/upload", {
  method: "POST",
  body: formData,
});


    const data = await res.json();
    if (res.ok) {
      setColumns(data.columns);
      setTableData(data.data);
    } else {
      alert(data.error || "Upload failed");
    }
  } catch (err) {
    alert("Server error during upload.");
    console.error(err);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📁 Upload Excel File</h2>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFile}
        className="mb-6"
      />

      {tableData.length > 0 && (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-4 py-2 border">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(0, 10).map((row, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-4 py-2 border">{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}