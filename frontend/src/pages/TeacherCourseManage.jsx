import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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

  // Function to encode filename for Azure Blob Storage
  function encodeFilename(filename) {
    // Replace spaces with %20 and encode other special characters
    return filename
      .replace(/\s+/g, '%20')  // Replace spaces with %20
      .replace(/[^a-zA-Z0-9\-_.%]/g, (char) => {
        // Encode other special characters
        return encodeURIComponent(char);
      });
  }

  async function getSasUrl(filename, contentType) {
    const encodedFilename = encodeFilename(filename);
    console.log("Getting SAS URL for:", filename, "-> encoded:", encodedFilename, contentType);
    const res = await fetch(`${base}/api/blob/sas?filename=${encodeURIComponent(encodedFilename)}&contentType=${encodeURIComponent(contentType)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("SAS request failed:", res.status, errorText);
      throw new Error(`Failed to get SAS: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    console.log("SAS URL received:", data);
    return data; // { uploadUrl, blobUrl }
  }

  async function uploadWithSas(file) {
    console.log("Uploading file to Azure Blob:", file.name, file.type, file.size);
    const { uploadUrl, blobUrl } = await getSasUrl(file.name, file.type || "application/octet-stream");
    
    const uploadRes = await fetch(uploadUrl, { 
      method: "PUT", 
      headers: { 
        "x-ms-blob-type": "BlockBlob", 
        "Content-Type": file.type || "application/octet-stream" 
      }, 
      body: file 
    });
    
    if (!uploadRes.ok) {
      console.error("Blob upload failed:", uploadRes.status, uploadRes.statusText);
      throw new Error(`Blob upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
    }
    
    console.log("File uploaded successfully to:", blobUrl);
    return blobUrl;
  }

  const handleUploadVideo = async (e) => {
    e.preventDefault(); setMsg("");
    if (!videoFile) {
      setMsg("Please select a video file");
      return;
    }
    try {
      setMsg("Uploading video...");
      console.log("Starting video upload process...");
      const url = await uploadWithSas(videoFile);
      console.log("Video uploaded to blob, saving to database...");
      
      // Store original filename in database, but use encoded URL for blob storage
      const res = await fetch(`${base}/api/videos`, { 
        method:"POST", 
        headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, 
        body: JSON.stringify({ 
          courseId: Number(id), 
          title: videoFile.name, // Original filename for display
          url: url // Encoded URL for blob storage
        }) 
      });
      if (res.ok) {
        setMsg("Video uploaded successfully!");
        setVideoFile(null);
        document.querySelector('input[type="file"][accept="video/*"]').value = '';
      } else {
        const errorData = await res.json();
        console.error("Database save failed:", res.status, errorData);
        setMsg("Failed to save video: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Video upload error:", error);
      setMsg("Upload failed: " + error.message);
    }
  };

  const handleUploadNote = async (e) => {
    e.preventDefault(); setMsg("");
    if (!noteFile) {
      setMsg("Please select a file");
      return;
    }
    try {
      setMsg("Uploading note...");
      console.log("Starting note upload process...");
      const url = await uploadWithSas(noteFile);
      console.log("Note uploaded to blob, saving to database...");
      
      // Store original filename in database, but use encoded URL for blob storage
      const res = await fetch(`${base}/api/notes`, { 
        method:"POST", 
        headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, 
        body: JSON.stringify({ 
          courseId: Number(id), 
          title: noteFile.name, // Original filename for display
          url: url, // Encoded URL for blob storage
          type: noteType 
        }) 
      });
      if (res.ok) {
        setMsg("Note uploaded successfully!");
        setNoteFile(null);
        document.querySelector('input[type="file"][accept*="pdf"]').value = '';
      } else {
        const errorData = await res.json();
        console.error("Database save failed:", res.status, errorData);
        setMsg("Failed to save note: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Note upload error:", error);
      setMsg("Upload failed: " + error.message);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault(); setMsg("");
    if (!quizTitle.trim()) {
      setMsg("Please enter a quiz title");
      return;
    }
    try {
      setMsg("Creating quiz...");
      // Create quiz
      const resQuiz = await fetch(`${base}/api/quizzes`, { method: "POST", headers: {"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ courseId: Number(id), title: quizTitle, timeLimit, totalMarks: questions.reduce((a,q)=>a+Number(q.marks||0),0) }) });
      if (!resQuiz.ok) { 
        const errorData = await resQuiz.json();
        setMsg("Failed to create quiz: " + (errorData.error || "Unknown error"));
        return; 
      }
      const quiz = await resQuiz.json();
      // Create questions + answers
      for (const q of questions) {
        if (!q.text.trim()) continue;
        const qRes = await fetch(`${base}/api/questions`, { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ quizId: quiz.id, text: q.text, marks: Number(q.marks||0) }) });
        if (!qRes.ok) {
          setMsg("Failed to create question");
          return;
        }
        const qCreated = await qRes.json();
        for (const a of q.answers) {
          if (!a.text.trim()) continue;
          const aRes = await fetch(`${base}/api/answers`, { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({ questionId: qCreated.id, text: a.text, isCorrect: !!a.isCorrect }) });
          if (!aRes.ok) {
            setMsg("Failed to create answer");
            return;
          }
        }
      }
      setMsg("Quiz created successfully!");
      setQuizTitle("");
      setQuestions([{ text: "", marks: 1, answers: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
    } catch (error) {
      setMsg("Quiz creation failed: " + error.message);
    }
  };

  const addQuestion = () => setQuestions(prev => [...prev, { text: "", marks: 1, answers: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Manage Course</h1>
          <div className="text-gray-700 mb-6">{course?.name}</div>

          <div className="grid md:grid-cols-2 gap-6">
            <form onSubmit={handleUploadVideo} className="bg-white rounded-xl shadow p-4 space-y-3">
              <h2 className="font-semibold">Upload Video</h2>
              <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files?.[0]||null)} className="w-full border rounded px-3 py-2" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 cursor-pointer">Upload Video</button>
            </form>

            <form onSubmit={handleUploadNote} className="bg-white rounded-xl shadow p-4 space-y-3">
              <h2 className="font-semibold">Upload Note</h2>
              <select value={noteType} onChange={e=>setNoteType(e.target.value)} className="w-full border rounded px-3 py-2">
                <option>PDF</option>
                <option>PPT</option>
              </select>
              <input type="file" accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={e=>setNoteFile(e.target.files?.[0]||null)} className="w-full border rounded px-3 py-2" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 cursor-pointer">Upload Note</button>
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
                    <label className="text-sm flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={a.isCorrect} onChange={e=>{
                        const v = e.target.checked; setQuestions(prev=>prev.map((qq,i)=> i===qi?{...qq, answers: qq.answers.map((aa,j)=> j===ai?{...aa, isCorrect:v}:aa)}:qq));
                      }} /> Correct
                    </label>
                  </div>
                ))}
                <button type="button" className="text-blue-600 text-sm cursor-pointer" onClick={()=> setQuestions(prev=> prev.map((qq,i)=> i===qi?{...qq, answers:[...qq.answers, { text: "", isCorrect: false }]}:qq))}>+ Add answer</button>
              </div>
            ))}
            <div className="flex gap-3">
              <button type="button" className="border rounded px-3 py-2 cursor-pointer" onClick={addQuestion}>+ Add question</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 cursor-pointer">Create Quiz</button>
            </div>
          </form>

          {msg && <div className="mt-4 text-sm text-gray-700">{msg}</div>}
        </div>
      </div>
    </div>
  );
}


