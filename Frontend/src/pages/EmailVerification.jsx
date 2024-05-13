import React, { useState, useEffect, useRef } from "react";
import axios from "./../axios";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";

function EmailVerification({ onClose, isOpen, role }) {
  const [inputs, setInputs] = useState(Array(6).fill(""));
  const inputRefs = useRef(inputs.map(() => React.createRef()));
  const navigate = useNavigate();

  const handleInputChange = (index) => (e) => {
    const newInputs = [...inputs];
    newInputs[index] = e.target.value;
    setInputs(newInputs);

    // Move to next input after typing, focus last input if all filled
    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = inputs.join("");
    if (role === "native") {
      try {
        const response = await axios.post("/native/verify", {
          verificationCode: code,
        });
        console.log(response);
        if (response.data === "User verified and registered successfully") {
          alert("signed up successfully");
          onClose();
          navigate("/native/NativeSignin");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post("/user/verify", {
          verificationCode: code,
        });
        console.log(response);
        if (response.data === "User verified and registered successfully") {
          alert("signed up successfully");
          onClose();
          navigate("/user/signin");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // Focus first input on component mount
    inputRefs.current[0].focus();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="px-4 py-6">
        <h2 className="block text-3xl md:text-2xl font-bold mb-8 text-center">
          Enter OTP
        </h2>
        <div className="flex justify-center gap-2 mb-6">
          {inputs.map((input, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
              type="text"
              maxLength="1"
              pattern="[0-9]"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={input}
              onChange={handleInputChange(index)}
              onKeyDown={handleKeyDown(index)}
            />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleVerify}
          >
            Verify
          </button>
          {/* Resend OTP Link */}
        </div>
      </form>
    </Modal>
  );
}

export default EmailVerification;
