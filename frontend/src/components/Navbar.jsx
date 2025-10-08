const Navbar = () => {
  return (
    <div className="flex justify-end items-center p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-sm text-gray-500">Student</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
