const QuizCard = ({ title, status }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
      <p className="font-semibold">{title}</p>
      <span className={`text-sm px-2 py-1 rounded ${status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}>
        {status}
      </span>
    </div>
  );
};

export default QuizCard;
