import React, { useState } from "react";
import useModal from "../../Hooks/useModal";
import ForgotPassOTP from "./ForgotPassOTP";
import axios from "../../axios";
import { useLocation, useNavigate } from "react-router-dom";


export default function () {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};
  console.log("role----------", role);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Assuming a simple state management for modal visibility
  const [userRole, setUserRole] = useState(role); // Managing user role state

  const toggleModal = () => setIsOpen(!isOpen); // Toggle modal visibility

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = role === "native" ? "/native/forgetpassword" : "/user/forgetpassword";
    try {
      const response = await axios.post(endpoint, { email });
      console.log(response);
      if (response.data === "Verification code sent to your email") {
        setUserRole(role); // Set the user role when opening the modal
        toggleModal(); // Now we also have the role ready to be passed to the modal
      } else if (response.status === 404) {
        alert("Email not found");
      } else {
        alert('An unexpected error occurred');
      }
    } catch (error) {
      console.error("Error object:", error);
      if (error.response && error.response.status === 404) {
        alert("Email not found");
      } else {
        alert('Error sending request');
      }
    }
  };

  return (
    <div
    className="container-fluid d-flex justify-content-center align-items-center vh-100"
    style={{ backgroundColor: "#E0E5EC" }}
  >
    <div
      style={{ backgroundColor: "white", borderRadius: 20 }}
      className="w-100 max-w-lg p-4 px-6 py-5 rounded-xl shadow-md"
    >
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column justify-content-center  mx-auto">
          <div className="d-flex flex-column  text-center">
            <h1
              style={{
                fontSize: 40,
                fontFamily: "PT Serif, serif",
                fontWeight: 300,
                // fontStyle: "italic",
              }}
              className="text-center my-2"
            >
              Confirm Mail
            </h1>
          </div>
          <div className="d-flex flex-column space-y-5">
            <label className="mt-4 form-label" htmlFor="firstname">
              Enter your mail
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="form-control px-3 py-2 md:px-4 md:py-3 m-1 outline-none rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              style={{ backgroundColor: " #007bff", color: "white" }}
              className="btn btn-primary primary-button"
            >
              Confirm
            </button>

            <button
              onClick={() => history.push("/user/signin")}
              type="button"
              style={{ backgroundColor: "#dc3545", color: "white" }}
              className="btn btn-danger"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      {/* Replace the below component with your component  */}
      {isOpen && <ForgotPassOTP isOpen={isOpen} onClose={toggleModal} role={userRole} />}
    </div>
  </div>
  );
}
