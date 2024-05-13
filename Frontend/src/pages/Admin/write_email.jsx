
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function WriteEmail({ userEmail, postData }) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Form submission handled with React");
  };

  useEffect(() => {
    if (postData) {
      console.log("Post Data Received:", postData);
      // Do something with postData here
    }
  }, [postData]);

  return (
    <div>
      <div className="p-8 mt-8 max-w-lg mx-auto">
        <form action="https://fabform.io/f/{form-id}" method="post" onSubmit={handleSubmit}>
          <div className="p-2 w-full">
          </div>
          <div className="p-2 w-full">
            <div className="relative">
              <label htmlFor="email" className="leading-7 py-4 text-lg text-gray-900">Email</label>
              <input
        type="email"
        id="email"
        name="email"
        defaultValue={userEmail} // Use defaultValue for controlled components
        required
        className="w-full bg-white rounded border border-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-900 py-1 px-1 leading-8 transition-colors duration-200 ease-in-out"
      />
            </div>
          </div>
          <div className="p-2 w-full">
            <div className="relative">
              <label htmlFor="message" className="leading-7 py-4 text-lg text-gray-900">Message</label>
              <textarea id="message" name="message" required
                className="w-full bg-white rounded border border-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-900 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
          </div>
          <div className="p-2 w-full">
            <button type="submit"
              className="flex text-white bg-gray-900 border-0 py-3 px-6 focus:outline-none hover:bg-blue-900 rounded text-lg font-bold shadow-lg mx-auto flex-col text-center">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
