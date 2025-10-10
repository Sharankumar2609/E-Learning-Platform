import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tab, setTab] = useState("videos");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`${base}/api/courses`);
        const courses = await courseRes.json();
        const currentCourse = courses.find(c => String(c.id) === String(id));
        setCourse(currentCourse);

        if (token) {
          // Check if student is enrolled
          const enrolledRes = await fetch(`${base}/api/students/me/courses`, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          if (enrolledRes.ok) {
            const enrolledCourses = await enrolledRes.json();
            const enrolled = enrolledCourses.some(c => c.id === Number(id));
            setIsEnrolled(enrolled);

            if (enrolled) {
              // Fetch course content only if enrolled
              const [videosRes, notesRes, quizzesRes] = await Promise.all([
                fetch(`${base}/api/videos/course/${id}`),
                fetch(`${base}/api/notes/course/${id}`),
                fetch(`${base}/api/quizzes/course/${id}`)
              ]);
              
              setVideos(await videosRes.json());
              setNotes(await notesRes.json());
              setQuizzes(await quizzesRes.json());
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="max-w-7xl mx-auto p-6 flex-1 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="max-w-7xl mx-auto p-6 flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{course?.name || "Course"}</h1>
              <p className="text-gray-600 mb-6">{course?.description}</p>
              <p className="text-lg mb-4">You need to enroll in this course to access its content.</p>
              <a href="/courses" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer">
                Go to Courses
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 flex-1">
          <h1 className="text-2xl font-bold mb-2">{course?.name || "Course"}</h1>
          <p className="text-gray-600 mb-6">{course?.description}</p>

          <div className="flex gap-3 mb-6">
            <button onClick={()=>setTab("videos")} className={`px-4 py-2 rounded cursor-pointer ${tab==='videos'?'bg-blue-600 text-white':'bg-white border'}`}>Videos</button>
            <button onClick={()=>setTab("notes")} className={`px-4 py-2 rounded cursor-pointer ${tab==='notes'?'bg-blue-600 text-white':'bg-white border'}`}>Notes</button>
            <button onClick={()=>setTab("quizzes")} className={`px-4 py-2 rounded cursor-pointer ${tab==='quizzes'?'bg-blue-600 text-white':'bg-white border'}`}>Quizzes</button>
          </div>

          {tab === "videos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-8">No videos available yet.</div>
              ) : (
                videos.map(v => (
                  <div key={v.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                    <h3 className="font-semibold mb-1">{v.title}</h3>
                    <a href={v.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm cursor-pointer hover:underline">Open video</a>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "notes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-8">No notes available yet.</div>
              ) : (
                notes.map(n => (
                  <div key={n.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                    <div className="text-xs text-gray-500 mb-1">{n.type}</div>
                    <h3 className="font-semibold mb-1">{n.title}</h3>
                    <a href={n.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm cursor-pointer hover:underline">Open</a>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "quizzes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-8">No quizzes available yet.</div>
              ) : (
                quizzes.map(q => (
                  <div key={q.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer">
                    <h3 className="font-semibold">{q.title}</h3>
                    {q.timeLimit ? <div className="text-xs text-gray-500">Time limit: {q.timeLimit} min</div> : null}
                    <div className="text-xs text-gray-500">Total Marks: {q.totalMarks || 0}</div>
                    <button 
                      onClick={() => navigate(`/quiz/${q.id}`)}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm cursor-pointer"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


