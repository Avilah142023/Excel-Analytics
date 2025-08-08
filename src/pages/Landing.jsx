import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleStart = () => {
    navigate("/login");
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Top Banner */}
      <div className="bg-teal-700 text-white text-sm text-center py-2">
        This is a Data Analytics Tool.
      </div>

      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-lg text-teal-700 font-bold">
  <img src="/icons/logo.png" alt="Chart Icon" className="w-5 h-5" />
  Excel Analytics
</div>
        <button
          onClick={handleStart}
          className="bg-teal-700 text-white px-4 py-2 text-sm rounded hover:bg-teal-800"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="text-center px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 leading-snug text-teal-700">
          Advanced data visualization for your spreadsheets
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload any Excel file, analyze your data, and generate interactive 2D and 3D charts with customization options. Save your work and build stunning visualizations.
        </p>
        <button
          onClick={handleStart}
          className="bg-teal-700 text-white px-6 py-3 rounded text-lg hover:bg-teal-800 transition"
        >
          Get Started
        </button>
      </section>

      {/* Features Heading */}
<h2 className="text-xl font-bold mt-0 mb-4 text-gray-800 text-center">Features</h2>


      {/* Scroll Arrows + Features Section */}
      <section className="relative max-w-6xl mx-auto px-6 mb-20">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>

        <div
  className="overflow-x-auto whitespace-nowrap no-scrollbar"
  ref={scrollRef}
>
  <div className="inline-flex space-x-6 ">
    {[
      {
        title: "Excel File Upload",
        desc: "Upload .xls or .xlsx files up to 50MB. Auto parse columns and headers.",
        icon: "📁",
        color: "bg-blue-100", 
      },
      {
        title: "Multiple Chart Types",
        desc: "Bar, line, pie, area, 3D charts and more.",
        icon: "📊",
        color: "bg-green-100", 
      },
      {
        title: "Analysis History",
        desc: "Access previous charts and continue editing anytime.",
        icon: "📈",
        color: "bg-sky-100", 
      },
      {
        title: "Admin Panel",
        desc: "Manage users, usage stats, and permissions.",
        icon: "⚙️",
        color: "bg-teal-100", 
      },
    ].map((f, i) => (
      <div
        key={i}
        className={`min-w-[260px] ${f.color} p-6 rounded shadow hover:shadow-md transition transform hover:scale-105`}
      >
        <div className="text-3xl mb-3">{f.icon}</div>
        <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
        <p className="text-sm text-gray-600">{f.desc}</p>
      </div>
    ))}
  </div>
</div>


        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-white py-10 px-6 border-t">
        <h2 className="text-xl font-semibold mb-3">Ready to Visualize Your Data?</h2>
        <p className="text-gray-600 mb-4">
          Join analysts turning spreadsheets into visual stories with Excel Analytics.
        </p>
        <button
          onClick={handleStart}
          className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800"
        >
          Sign In to Continue
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6">
        © 2025 Excel Analytics. Built with the MERN stack.
      </footer>
    </div>
  );
}
