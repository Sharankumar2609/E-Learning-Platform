import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import SubjectCard from "../components/SubjectCard";
import QuizCard from "../components/QuizCard";
import { BookOpen, ClipboardList, Video } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Welcome back, John!</h2>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card title="Subjects" value="3" icon={<BookOpen />} />
            <Card title="Quizzes" value="5" icon={<ClipboardList />} />
            <Card title="Videos" value="2" icon={<Video />} />
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
            <h3 className="font-semibold mb-4">Your Subjects</h3>
            <div className="grid grid-cols-2 gap-4">
              <SubjectCard name="Biology" icon="🌿" />
              <SubjectCard name="Mathematics" icon="π" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
