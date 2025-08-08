import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import UploadHistory from "./pages/UploadHistory";
import Downloads from './pages/Downloads';
import AdminPanel from "./pages/AdminPanel";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/history" element={<UploadHistory />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/admin" element={<AdminPanel />} />



    </Routes>
  );
}

export default App;
