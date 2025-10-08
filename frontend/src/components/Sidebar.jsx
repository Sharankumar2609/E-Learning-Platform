import { Home, BookOpen, ClipboardList, Video } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-8">E-Learn</h1>
      <nav className="flex flex-col gap-6">
        <a href="/dashboard" className="flex items-center gap-3 hover:text-gray-300">
          <Home size={20} /> Dashboard
        </a>
        <a href="/subjects" className="flex items-center gap-3 hover:text-gray-300">
          <BookOpen size={20} /> Subjects
        </a>
        <a href="/quizzes" className="flex items-center gap-3 hover:text-gray-300">
          <ClipboardList size={20} /> Quizzes
        </a>
        <a href="/videos" className="flex items-center gap-3 hover:text-gray-300">
          <Video size={20} /> Videos
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
