import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/courses`)
      .then(r => r.json())
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 flex-1">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">All Courses</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map(c => (
              <a key={c.id} href={`/courses/${c.id}`} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-3" />
                )}
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


