const Navbar = () => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const name = user?.name || "Student";
  const role = user?.role || "Student";
  const photo = user?.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name);
  return (
    <div className="flex justify-end items-center p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <img src={photo} alt="profile" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
