import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

export default function TeacherCourseManage() {
  const { id } = useParams();
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [noteFile, setNoteFile] = useState(null);
  const [noteType, setNoteType] = useState("PDF");
  const [quizTitle, setQuizTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState([{ text: "", marks: 1, answers: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${base}/api/courses`).then(r=>r.json()).then(list=>{
      setCourse(list.find(c => String(c.id) === String(id)) || null);
    });
  }, [id]);

  async function getSasUrl(filename, contentType) {
    const res = await fetch(`${base}/api/blob/sas?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to get SAS");
    return res.json(); // { uploadUrl, blobUrl }
  }

  async function uploadWithSas(file) {
    const { uploadUrl, blobUrl } = await getSasUrl(file.name, file.type || "application/octet-stream");
    await fetch(uploadUrl, { method: "PUT", headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": file.type || "application/octet-stream" }, body: file });
    return blobUrl;
  }

  const handleUploadVideo = async (e) => {
    e.preventDefault(); setMsg("");
    if (!videoFile) return;
    const url = await uploadWithSas(videoFile);
    const res = await fetch(`${base}/api/videos`, { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ courseId: Number(id), title: videoFile.name, url }) });
    setMsg(res.ok ? "Video uploaded" : "Failed to save video");
  };

  const handleUploadNote = async (e) => {
    e.preventDefault(); setMsg("");
    if (!noteFile) return;
    const url = await uploadWithSas(noteFile);
    const res = await fetch(`${base}/api/notes`, { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ courseId: Number(id), title: noteFile.name, url, type: noteType }) });
    setMsg(res.ok ? "Note uploaded" : "Failed to save note");
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault(); setMsg("");
    // Create quiz
    const resQuiz = await fetch(`${base}/api/quizzes`, { method: "POST", headers: {"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ courseId: Number(id), title: quizTitle, timeLimit, totalMarks: questions.reduce((a,q)=>a+Number(q.marks||0),0) }) });
    if (!resQuiz.ok) { setMsg("Failed to create quiz"); return; }
    const quiz = await resQuiz.json();
    // Create questions + answers
    for (const q of questions) {
      const qRes = await fetch(`${base}/api/questions`, { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ quizId: quiz.id, text: q.text, marks: Number(q.marks||0) }) });
      const qCreated = await qRes.json();
      for (const a of q.answers) {
        await fetch(`${base}/api/answers`, { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ questionId: qCreated.id, text: a.text, isCorrect: !!a.isCorrect }) });
      }
    }
    setMsg("Quiz created");
  };

  const addQuestion = () => setQuestions(prev => [...prev, { text: "", marks: 1, answers: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Course</h1>
        <div className="text-gray-700 mb-6">{course?.name}</div>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleUploadVideo} className="bg-white rounded-xl shadow p-4 space-y-3">
            <h2 className="font-semibold">Upload Video</h2>
            <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files?.[0]||null)} />
            <button className="bg-blue-600 text-white rounded px-4 py-2">Upload</button>
          </form>

          <form onSubmit={handleUploadNote} className="bg-white rounded-xl shadow p-4 space-y-3">
            <h2 className="font-semibold">Upload Note</h2>
            <select value={noteType} onChange={e=>setNoteType(e.target.value)} className="border rounded px-2 py-1">
              <option>PDF</option>
              <option>PPT</option>
            </select>
            <input type="file" accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={e=>setNoteFile(e.target.files?.[0]||null)} />
            <button className="bg-blue-600 text-white rounded px-4 py-2">Upload</button>
          </form>
        </div>

        <form onSubmit={handleCreateQuiz} className="bg-white rounded-xl shadow p-4 space-y-3 mt-6">
          <h2 className="font-semibold">Create Quiz</h2>
          <input value={quizTitle} onChange={e=>setQuizTitle(e.target.value)} placeholder="Quiz title" className="w-full border rounded px-3 py-2" required />
          <input type="number" value={timeLimit} onChange={e=>setTimeLimit(Number(e.target.value))} placeholder="Time limit (minutes)" className="w-full border rounded px-3 py-2" />
          {questions.map((q, qi) => (
            <div key={qi} className="border rounded p-3 space-y-2">
              <input value={q.text} onChange={e=>{
                const v = e.target.value; setQuestions(prev=>prev.map((qq,i)=> i===qi?{...qq, text:v}:qq));
              }} placeholder={`Question ${qi+1}`} className="w-full border rounded px-2 py-1" />
              <input type="number" value={q.marks} onChange={e=>{
                const v = Number(e.target.value); setQuestions(prev=>prev.map((qq,i)=> i===qi?{...qq, marks:v}:qq));
              }} className="w-32 border rounded px-2 py-1" placeholder="Marks" />
              {q.answers.map((a, ai) => (
                <div key={ai} className="flex items-center gap-2">
                  <input value={a.text} onChange={e=>{
                    const v = e.target.value; setQuestions(prev=>prev.map((qq,i)=> i===qi?{...qq, answers: qq.answers.map((aa,j)=> j===ai?{...aa, text:v}:aa)}:qq));
                  }} placeholder={`Answer ${ai+1}`} className="flex-1 border rounded px-2 py-1" />
                  <label className="text-sm flex items-center gap-1">
                    <input type="checkbox" checked={a.isCorrect} onChange={e=>{
                      const v = e.target.checked; setQuestions(prev=>prev.map((qq,i)=> i===qi?{...qq, answers: qq.answers.map((aa,j)=> j===ai?{...aa, isCorrect:v}:aa)}:qq));
                    }} /> Correct
                  </label>
                </div>
              ))}
              <button type="button" className="text-blue-600 text-sm" onClick={()=> setQuestions(prev=> prev.map((qq,i)=> i===qi?{...qq, answers:[...qq.answers, { text: "", isCorrect: false }]}:qq))}>+ Add answer</button>
            </div>
          ))}
          <div className="flex gap-3">
            <button type="button" className="border rounded px-3 py-2" onClick={addQuestion}>+ Add question</button>
            <button className="bg-blue-600 text-white rounded px-4 py-2">Create Quiz</button>
          </div>
        </form>

        {msg && <div className="mt-4 text-sm text-gray-700">{msg}</div>}
      </div>
    </div>
  );
}


