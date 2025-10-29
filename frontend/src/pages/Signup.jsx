import { useState } from "react";
import AuthNavbar from "../components/AuthNavbar";

export default function Signup() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const base = import.meta.env.VITE_API_URL || "https://backend.bluebeach-698d2239.centralindia.azurecontainerapps.io";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const url = role === "teacher" ? `${base}/api/teachers/signup` : `${base}/api/students/signup`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, photo: photo || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = role === "teacher" ? "/teacher/create-course" : "/dashboard";
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <div className="flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-md p-6 rounded-xl shadow space-y-4">
        <h1 className="text-xl font-semibold">Create your account</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-3">
          <button type="button" className={`px-3 py-2 rounded cursor-pointer ${role==='student'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setRole('student')}>Student</button>
          <button type="button" className={`px-3 py-2 rounded cursor-pointer ${role==='teacher'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setRole('teacher')}>Teacher</button>
        </div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border rounded px-3 py-2" required />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" required />
        <input value={photo} onChange={e=>setPhoto(e.target.value)} placeholder="Photo URL (optional)" className="w-full border rounded px-3 py-2" />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 cursor-pointer">Sign up</button>
        <div className="text-sm text-center">Already have an account? <a className="text-blue-600 cursor-pointer hover:underline" href="/login">Log in</a></div>
      </form>
      </div>
    </div>
  );
}


