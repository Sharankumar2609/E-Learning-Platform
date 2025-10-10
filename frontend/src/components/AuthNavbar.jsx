const AuthNavbar = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const user = stored ? JSON.parse(stored) : null;
  const name = user?.name || "";
  const photo = user?.photo || (name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}` : "");
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1" />
        <div className="text-xl font-semibold">E-Learn</div>
        <div className="flex-1 flex justify-end items-center gap-2">
          {name ? (
            <>
              <span className="text-sm text-gray-700">{name}</span>
              <img src={photo} alt="profile" className="w-8 h-8 rounded-full" />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AuthNavbar;


