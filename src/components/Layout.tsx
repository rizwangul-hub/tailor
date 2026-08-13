import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiKey, FiUsers, FiActivity, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import clsx from 'clsx';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Licenses', path: '/licenses', icon: FiKey },
    { name: 'Tenants', path: '/tenants', icon: FiUsers },
    { name: 'Audit Logs', path: '/audit-logs', icon: FiActivity },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-20">
        <h1 className="text-xl font-bold tracking-wider">TAILOR ADMIN</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full pt-16 md:pt-0"
        )}
      >
        <div className="hidden md:block p-6">
          <h1 className="text-2xl font-bold tracking-wider">TAILOR ADMIN</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white w-full transition-colors rounded-lg hover:bg-slate-800"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0 h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
