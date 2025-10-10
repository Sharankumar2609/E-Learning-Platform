import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function CourseDetail() {
  const { id } = useParams();
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tab, setTab] = useState("videos");

  useEffect(() => {
    fetch(`${base}/api/courses`)
      .then(r => r.json())
      .then(list => setCourse(list.find(c => String(c.id) === String(id)) || null));
    fetch(`${base}/api/videos/course/${id}`).then(r=>r.json()).then(setVideos);
    fetch(`${base}/api/notes/course/${id}`).then(r=>r.json()).then(setNotes);
    fetch(`${base}/api/quizzes/course/${id}`).then(r=>r.json()).then(setQuizzes);
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 flex-1">
          <h1 className="text-2xl font-bold mb-2">{course?.name || "Course"}</h1>
          <p className="text-gray-600 mb-6">{course?.description}</p>

          <div className="flex gap-3 mb-6">
            <button onClick={()=>setTab("videos")} className={`px-4 py-2 rounded ${tab==='videos'?'bg-blue-600 text-white':'bg-white border'}`}>Videos</button>
            <button onClick={()=>setTab("notes")} className={`px-4 py-2 rounded ${tab==='notes'?'bg-blue-600 text-white':'bg-white border'}`}>Notes</button>
            <button onClick={()=>setTab("quizzes")} className={`px-4 py-2 rounded ${tab==='quizzes'?'bg-blue-600 text-white':'bg-white border'}`}>Quizzes</button>
          </div>

          {tab === "videos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map(v => (
                <div key={v.id} className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-1">{v.title}</h3>
                  <a href={v.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">Open video</a>
                </div>
              ))}
            </div>
          )}

          {tab === "notes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map(n => (
                <div key={n.id} className="bg-white rounded-xl shadow p-4">
                  <div className="text-xs text-gray-500 mb-1">{n.type}</div>
                  <h3 className="font-semibold mb-1">{n.title}</h3>
                  <a href={n.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">Open</a>
                </div>
              ))}
            </div>
          )}

          {tab === "quizzes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map(q => (
                <div key={q.id} className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold">{q.title}</h3>
                  {q.timeLimit ? <div className="text-xs text-gray-500">Time limit: {q.timeLimit} min</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


