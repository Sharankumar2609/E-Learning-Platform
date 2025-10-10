import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function TeacherCreateCourse() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const createCourse = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/api/teachers/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, imageUrl })
      });
      if (!res.ok) throw new Error("Failed to create course");
      setMessage("Course created!");
      setName(""); setDescription(""); setImageUrl("");
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto p-6 w-full">
          <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
          <form onSubmit={createCourse} className="bg-white rounded-xl shadow p-4 space-y-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Course name" className="w-full border rounded px-3 py-2" required />
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)" className="w-full border rounded px-3 py-2" />
            <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full border rounded px-3 py-2" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 cursor-pointer">Create</button>
            {message && <div className="text-sm text-gray-700">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}


