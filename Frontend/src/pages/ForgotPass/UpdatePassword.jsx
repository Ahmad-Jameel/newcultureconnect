import React, { useState } from 'react';
import Modal from '../../Modal/Modal';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword({ isOpen, onClose, role }) {
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isPasswordValid, setPasswordValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password must have at least 6 characters, 1 alphabetic, 1 special character, and 1 numeric
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(pass)) {
      alert('Please enter a valid password with at least 6 characters, including 1 alphabetic, 1 special character, and 1 numeric.');
      return; // Do not proceed with password update
    }

    const endpoint = role === "native" ? '/native/changepassword' : '/user/changepassword';

    try {
      if (pass === confirmPass) {
        const response = await axios.post(endpoint, { pass }); // Use the endpoint based on role
        console.log(response);
        if (response.data === "data updated") {
          alert('Password updated');
          if (role === "native") {
            navigate('/native/NativeSignin');
          } else {
            navigate('/user/signin');
          } 
        }
      } else {
        alert('Password and confirm password should be the same');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="rounded-md p-4">
        <h1 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-400">
          Update Your Password
        </h1>

        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${isPasswordValid ? "" : "border-red-500"}`}
          placeholder="Password"
          type="password"
          name="password"
          id="password"
          required
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setPasswordValid(true); // Reset the password validation status
          }}
        />
        {!isPasswordValid && (
          <div style={{ color: "#FF0000" }}>
            Please enter a valid password with at least 6 characters, including 1 alphabetic, 1 special character, and 1 numeric.
          </div>
        )}

        <label htmlFor="ConfirmPassword" className="block mt-4 text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Confirm Password"
          type="password"
          name="confirmPassword"
          id="ConfirmPassword"
          required
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        <button
          className="mt-6 w-full px-4 py-2 text-white rounded-md bg-teal-500 hover:bg-teal-700"
          onClick={handleSubmit}
        >
          Update Password
        </button>
        <button
          className="mt-3 w-full px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
