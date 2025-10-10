import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState("");
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${base}/api/courses`)
      .then(r => r.json())
      .then(setCourses)
      .catch(() => setCourses([]));
    
    if (token) {
      fetch(`${base}/api/students/me/courses`, { headers: { Authorization: `Bearer ${token}` }})
        .then(r => r.ok ? r.json() : [])
        .then(setEnrolledCourses)
        .catch(() => setEnrolledCourses([]));
    }
  }, [token]);

  const handleEnroll = async (courseId) => {
    if (!token) {
      setMessage("Please login to enroll");
      return;
    }
    try {
      const res = await fetch(`${base}/api/courses/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId })
      });
      if (res.ok) {
        setMessage("Successfully enrolled!");
        setEnrolledCourses(prev => [...prev, courses.find(c => c.id === courseId)]);
      } else {
        const errorData = await res.json();
        setMessage("Enrollment failed: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("Enrollment failed: " + error.message);
    }
  };

  const isEnrolled = (courseId) => enrolledCourses.some(c => c.id === courseId);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 flex-1">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">All Courses</h1>
          {message && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">{message}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map(c => (
              <div key={c.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-3" />
                )}
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{c.description}</p>
                {isEnrolled(c.id) ? (
                  <a href={`/courses/${c.id}`} className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded cursor-pointer">
                    View Course
                  </a>
                ) : (
                  <button 
                    onClick={() => handleEnroll(c.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer"
                  >
                    Enroll
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


