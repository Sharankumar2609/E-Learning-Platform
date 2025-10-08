const SubjectCard = ({ name, icon }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg flex items-center gap-3">
      <div className="text-blue-600 text-2xl">{icon}</div>
      <p className="font-semibold">{name}</p>
    </div>
  );
};

export default SubjectCard;
