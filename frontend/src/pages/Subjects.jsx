import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Subjects = () => {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Biology",
      description:
        "Explore the study of living organisms, genetics, and ecosystems.",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc",
      enrolled: false,
    },
    {
      id: 2,
      name: "Mathematics",
      description:
        "Master algebra, geometry, and problem-solving strategies.",
      image: "https://images.unsplash.com/photo-1581091012184-5c8af7e3f8a7",
      enrolled: false,
    },
    {
      id: 3,
      name: "Chemistry",
      description:
        "Learn about reactions, periodic elements, and real-world applications.",
      image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
      enrolled: false,
    },
    {
      id: 4,
      name: "Physics",
      description:
        "Understand motion, energy, and the forces shaping our universe.",
      image: "https://images.unsplash.com/photo-1614386670632-9b56e0fca0a3",
      enrolled: false,
    },
    {
      id: 5,
      name: "Computer Science",
      description:
        "Learn programming, algorithms, and data structures fundamentals.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      enrolled: false,
    },
  ]);

  const handleEnroll = (id) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === id ? { ...subject, enrolled: true } : subject
      )
    );
    // Future: Send POST request to backend API here
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto p-6 flex-1">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Available Subjects
          </h1>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-4 flex flex-col"
              >
                <img
                  src={subject.image}
                  alt={subject.name}
                  className="w-full h-44 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{subject.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {subject.description}
                </p>

                <button
                  onClick={() => handleEnroll(subject.id)}
                  disabled={subject.enrolled}
                  className={`mt-auto py-2 px-4 rounded-xl font-medium text-white transition ${
                    subject.enrolled
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {subject.enrolled ? "Enrolled ✓" : "Enroll"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
