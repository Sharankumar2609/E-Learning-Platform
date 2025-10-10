import { Home, BookOpen, Layers, Video, PlusCircle } from "lucide-react";

const Sidebar = () => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const role = user?.role || "student";
  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-8">E-Learn</h1>
      <nav className="flex flex-col gap-6">
        {role === 'teacher' ? (
          <>
            <a href="/teacher/create-course" className="flex items-center gap-3 hover:text-gray-300">
              <PlusCircle size={20} /> Create Course
            </a>
            <a href="/teacher/courses" className="flex items-center gap-3 hover:text-gray-300">
              <Layers size={20} /> Your Courses
            </a>
          </>
        ) : (
          <>
            <a href="/dashboard" className="flex items-center gap-3 hover:text-gray-300">
              <Home size={20} /> Dashboard
            </a>
            <a href="/courses" className="flex items-center gap-3 hover:text-gray-300">
              <Layers size={20} /> Courses
            </a>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
