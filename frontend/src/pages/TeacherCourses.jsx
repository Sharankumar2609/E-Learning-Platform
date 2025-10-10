import AuthNavbar from "../components/AuthNavbar";
import { useEffect, useState } from "react";

export default function TeacherCourses() {
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [courses, setCourses] = useState([
    { id: 101, name: "Intro to Web Dev", description: "HTML, CSS, JS", imageUrl: "", videos: [{id:1,title:"Lesson 1",url:"https://example.com/video1"}], notes: [{id:1,title:"Slides 1",url:"https://example.com/slides1.pdf", type:"PDF"}], quizzes: [{id:1,title:"Lesson 1 Quiz", timeLimit:15}] },
    { id: 102, name: "Data Structures", description: "Arrays, Lists", imageUrl: "", videos: [{id:2,title:"Arrays",url:"https://example.com/video2"}], notes: [{id:2,title:"Arrays PPT",url:"https://example.com/arrays.pptx", type:"PPT"}], quizzes: [{id:2,title:"Arrays Quiz", timeLimit:10}] },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${base}/api/teachers/courses`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r=>r.ok?r.json():[])
      .then(list => {
        if (Array.isArray(list) && list.length) setCourses(list);
      })
      .catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <div className="max-w-7xl mx-auto p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Your Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <a key={c.id} href={`/teacher/courses/${c.id}`} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">{c.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{c.description}</p>
              <div className="text-sm mb-1">Videos: {c.videos?.length || 0}</div>
              <div className="text-sm mb-1">Notes: {c.notes?.length || 0}</div>
              <div className="text-sm">Quizzes: {c.quizzes?.length || 0}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}


