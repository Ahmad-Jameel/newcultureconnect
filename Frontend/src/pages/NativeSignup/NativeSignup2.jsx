import React, { useState, useContext } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import pic13 from "../../assets/light11.jpg";
import { UserContext } from "../../Context/UserContext";

function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const response = await axios.post("/native/signIn", {
          email: email,
          pass: password,
        });

        console.log(response);

        if (response.status === 200) {
          const userInfo = {
            token: response.data.accessToken,
            id: response.data.user_ID.UserID,
            roles: response.data.user_ID.role,
          };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setUser(userInfo);
          navigate("/user/Homepage");
        } else if (response.status === 401) {
          setErrorMessage("Invalid Credentials");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Invalid Credentials");
      }
    } else {
      setErrorMessage("Please ensure all fields are correctly filled out.");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Add email validation logic
    setEmailError(!isValidEmail(value)); // Example isValidEmail function
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Add password validation logic
    setPasswordError(!isValidPassword(value)); // Example isValidPassword function
  };

  // Example validation functions
  const isValidEmail = (email) => {
    // Implement your email validation logic here
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    // Implement your password validation logic here
    return password.length >= 8;
  };

  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#E0E5EC" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-2"></div>
            <div
              style={{ padding: 0 }}
              className="col-md-4 d-flex justify-content-center"
            >
              <img
                style={{ borderRadius: "20px 0px 0px 20px" }}
                src={pic13}
                alt=""
                className="img-fluid"
              />
            </div>
            <div style={{ padding: 0 }} className="col-md-4">
              <form
                action=""
                onSubmit={handleSubmit}
                className="px-3 py-2"
                style={{
                  backgroundColor: "white",
                  borderRadius: "0px 20px 20px 0px",
                }}
              >
                <div className="flex flex-col">
                  <h1
                    style={{
                      fontSize: 30,
                      fontFamily: "PT Serif, serif",
                      fontWeight: 300,
                    }}
                    className="text-center my-2"
                  >
                    Login
                  </h1>
                  <div className="flex flex-col m-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      className={`px-2 py-1 m-1 outline-none rounded-md form-control ${
                        emailError ? "border-red-500" : ""
                      }`}
                      placeholder="Email"
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {emailError && (
                      <span className="text-red-500">Invalid email format</span>
                    )}
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      className={`px-2 py-1 m-1 outline-none rounded-md form-control ${
                        passwordError ? "border-red-500" : ""
                      }`}
                      placeholder="Password"
                      type="password"
                      name="password"
                      id="password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {passwordError && (
                      <span className="text-red-500">
                        Password must be at least 8 characters long
                      </span>
                    )}
                    <a
                      className="text-indigo-700 hover:text-pink-700 text-sm float-left mt-1"
                      onClick={() =>
                        navigate("/user/forgetPassword", {
                          state: {
                            role: "native",
                          },
                        })
                      }
                    >
                      Forgot Password?
                    </a>
                    <button
                      style={{
                        backgroundColor: "#007bff",
                        borderColor: "#007bff",
                        color: "#fff",
                      }}
                      class="btn btn mt-3"
                      type="submit"
                      value="Login"
                    >
                      Login
                    </button>
                  </div>
                  <footer>
                    <a
                      className="text-indigo-700 hover:text-pink-700 text-sm float-right mt-1"
                      href="#"
                      onClick={() => navigate("/user/NativeSignup")}
                    >
                      Create Account
                    </a>
                  </footer>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
