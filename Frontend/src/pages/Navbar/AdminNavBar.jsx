import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Navbar2() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <style>
  {`
    .animated-link {
      transition: color 0.3s ease, transform 0.3s ease;
      display: inline-block;
    }
    .animated-link:hover {
      color: #4f46e5; 
      transform: translateX(5px) scale(1.1); 
    }
  `}
</style>

      <div className="flex overflow-hidden bg-gray-200">
        <div className={`absolute bg-gray-800 text-white z-20 w-56 min-h-screen overflow-y-auto transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ease-in-out duration-300`}>
          <div className="p-4">
            <h1 className="text-2xl font-semibold"></h1>
            <ul className="mt-4">
              <li className="mb-2">
                {/* Changed to use href for navigation */}
                <a href="/adminfeedback" className="block animated-link">Home</a>
              </li>
              <li className="mb-2">
                <a href="/addads" className="block animated-link">Add Ads</a>
              </li>
              <li className="mb-2">
                <a href="/addNotification" className="block animated-link">Add Notification</a>
              </li>
              <li className="mb-2">
                <a href="/admin_check_payment" className="block animated-link">Payment</a>
              </li>
              <li className="mb-2">
                <a href="/admin_check_payment" className="block animated-link">Logout</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-dark">
          <div className="bg-dark text-white shadow">
            <div className="container mx-auto">
              <div className="flex justify-between items-center py-4 px-2">
                <h1 className="text-xl font-semibold">CultureConnect</h1>
                <button className="text-gray-500 hover:text-gray-600" onClick={toggleSidebar}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={closeSidebar}></div>
      )}
    </div>
  );
}
