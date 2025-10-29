import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Videos from "./pages/Videos";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TeacherCreateCourse from "./pages/TeacherCreateCourse";
import TeacherCourses from "./pages/TeacherCourses";
import TeacherCourseManage from "./pages/TeacherCourseManage";
import QuizTaking from "./pages/QuizTaking";

function App() {
  const base = import.meta.env.VITE_API_URL
  console.log("API Base URL:", base);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/teacher/create-course" element={<TeacherCreateCourse />} />
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route path="/teacher/courses/:id" element={<TeacherCourseManage />} />
        <Route path="/quiz/:quizId" element={<QuizTaking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
