import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import SubjectCard from "../components/SubjectCard";
import QuizCard from "../components/QuizCard";
import { BookOpen, ClipboardList, Video } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({ numCourses: 0, totalVideos: 0, completedQuizzes: 0, pendingQuizzes: 0 });
  const [courses, setCourses] = useState([]);
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${base}/api/students/me/metrics`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setStats).catch(()=>{});
    fetch(`${base}/api/students/me/courses`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setCourses).catch(()=>{});
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Welcome back!</h2>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card title="Courses" value={String(stats.numCourses)} icon={<BookOpen />} />
            <Card title="Quizzes Completed" value={String(stats.completedQuizzes)} icon={<ClipboardList />} />
            <Card title="Videos" value={String(stats.totalVideos)} icon={<Video />} />
          </div>

          {/* Recent + Pending */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Recent History</h3>
              <QuizCard title="Introduction to Biology" status="Completed" />
              <QuizCard title="Introduction to Algebra" status="Completed" />
            </div>
            <div>
              <h3 className="font-semibold mb-4">Pending Quizzes</h3>
              <QuizCard title="Chemistry" status="Pending" />
              <QuizCard title="Biology" status="Pending" />
              <QuizCard title="Algebra" status="Pending" />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-semibold mb-4">Your Courses</h3>
            <div className="grid grid-cols-2 gap-4">
              {courses.map(c => (
                <a key={c.id} href={`/courses/${c.id}`} className="p-4 bg-white shadow rounded-lg flex items-center gap-3 hover:shadow-lg transition cursor-pointer">
                  <div className="text-blue-600 text-2xl">🎓</div>
                  <p className="font-semibold">{c.name}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
