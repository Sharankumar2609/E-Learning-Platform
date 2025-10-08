const Card = ({ title, value, icon }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Card;
