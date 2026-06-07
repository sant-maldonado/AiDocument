import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-bold tracking-tight">AiDocument</h1>
      <button
        onClick={logout}
        className="text-sm text-gray-300 hover:text-white transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}
