import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function QuizTaking() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      // Fetch quiz details
      const quizRes = await fetch(`${base}/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!quizRes.ok) throw new Error("Failed to fetch quiz");
      const quizData = await quizRes.json();
      setQuiz(quizData);

      // Fetch questions with answers
      const questionsRes = await fetch(`${base}/api/questions/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!questionsRes.ok) throw new Error("Failed to fetch questions");
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);

      // Set timer
      if (quizData.timeLimit) {
        setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    try {
      const response = await fetch(`${base}/api/user-quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: parseInt(quizId),
          answers: answers,
          timeSpent: quiz.timeLimit * 60 - timeLeft
        })
      });

      if (!response.ok) throw new Error("Failed to submit quiz");
      const result = await response.json();
      setScore(result);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-lg">Loading quiz...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-600 text-lg">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted && score) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-semibold mb-2">
                Score: {score.score}/{score.totalMarks}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                Percentage: {Math.round((score.score / score.totalMarks) * 100)}%
              </div>
              <div className="text-sm text-gray-500 mb-6">
                Time spent: {formatTime(score.timeSpent)}
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer"
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 w-full">
          {/* Quiz Header */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <p className="text-gray-600">Total Questions: {questions.length}</p>
                <p className="text-gray-600">Total Marks: {quiz.totalMarks}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-500">Time Remaining</div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-xl shadow p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Question {index + 1} ({question.marks} marks)
                  </h3>
                  <p className="text-gray-700">{question.text}</p>
                </div>
                
                <div className="space-y-3">
                  {question.answers.map((answer) => (
                    <label
                      key={answer.id}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={answers[question.id] === answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{answer.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg text-lg font-semibold cursor-pointer"
            >
              {isSubmitted ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
