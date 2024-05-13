import React, { useState, useEffect } from "react";
import axios from "../../axios"; // Ensure this is the correct path to your Axios instance
import logopic from "../../assets/logo.png";
import { useLocation } from 'react-router-dom';


export default function Notification({userId}) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/user/getallnotification?id=${userId}`);
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Function to format date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    const date = new Date(dateString);
    return date.toDateString("en-US", options);
  };

  return (
    <div className="absolute bg-white top-16 rounded-lg max-w-[400px] w-[400px] h-[400px] overflow-y-scroll overflow-x-hidden">
      <div className="flex flex-col gap-3">
        {notifications.map((notification, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg shadow-lg">
            <button onClick={(e) => e.target.closest(".relative").remove()} className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center p-4">
              <img className="object-cover w-12 h-12 rounded-lg" src={logopic} alt="Admin" />
              <div className="ml-3 overflow-hidden">
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  Admin <span className="text-xs text-gray-500">({formatDate(notification.createdAt)})</span>
                </p>
                <p className="text-sm font-bold text-gray-700">{notification.Notification_Title}</p>
                <p className="max-w-xs text-sm text-gray-500 truncate">{notification.Notification_Description}</p>
                <p className="text-xs text-gray-400">{notification.Date} at {notification.Time}</p>
                <p className="text-xs text-gray-400">
                  {notification.City}, {notification.Area}, {notification.State}, {notification.AddressNumber}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}