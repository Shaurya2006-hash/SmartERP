"use client";

export default function Dashboard() {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        SmartERP Dashboard
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}