import logo from "../../assets/logo.png";
import "../NativeSignup/NativeSignup.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import axios from "../../axios";
import { useNavigate, Link } from "react-router-dom";
import EmailVerification from "../EmailVerification";
import useModal from "../../Hooks/useModal";

export default function NativeSignup() {
  const navigate = useNavigate();

  const sectionStyle = {
    backgroundColor: "white",
  };

  const [isOpen, toggleModal] = useModal();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");

  const [province, setProvince] = useState("");
  const [language, setLanguage] = useState("");
  const [service, setService] = useState("");
  const [qualification, setQualification] = useState("");
  const [fieldQualification, setFieldQualification] = useState("");
  const [cityError, setCityError] = useState(false);

  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [firstnameError, setFirstnameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [provinceError, setProvinceError] = useState(false);
  const [languageError, setLanguageError] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const [qualificationError, setQualificationError] = useState(false);
  const [fieldQualificationError, setFieldQualificationError] = useState(false);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setCityError(value === "");
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    // Split the input value by spaces and filter out any empty strings in case of multiple spaces
    const words = value.split(' ').filter(Boolean);
    setService(value);
    // Check if the number of words is less than 5
    setServiceError(words.length < 5);
};

const handleFieldQualificationChange = (e) => {
    const value = e.target.value;
    // Similarly, split and filter for the qualification field
    const words = value.split(' ').filter(Boolean);
    setFieldQualification(value);
    // And check the word count for the qualification field as well
    setFieldQualificationError(words.length < 5);
};

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    setPassword(value);
    setPasswordError(!passwordRegex.test(value));
  };
  const controlFormToggle = () => {
    setIsLoginForm(!isLoginForm);
    setEmail("");
    setFirstname("");
    setLastname("");
    setName("");
    setPassword("");
    setPhone("");
    setError(false);
    setPhoneError(false);
    setEmailError(false);
    setFirstnameError(false);
    setLastnameError(false);
    setNicknameError(false);
    setPasswordError(false);
    setProvinceError(false);
    setLanguageError(false);
    setServiceError(false);
    setQualificationError(false);
    setFieldQualificationError(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const phoneRegex = /^03\d{9}$/;
    setPhone(value);
    setPhoneError(!phoneRegex.test(value) || value === "");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    
    const emailRegex = /^(?:(?:[a-zA-Z][a-zA-Z0-9._%+-]{4,})@gmail\.com|[a-z][0-9]{6}@cfd\.nu\.edu\.pk)$/;
    setEmail(value);
    setEmailError(!emailRegex.test(value));
  };

  const handleFirstnameChange = (e) => {
    const value = e.target.value;
    const nameRegex = /^[A-Za-z]{3,}[A-Za-z]*$/; // At least 3 characters, only letters
    setFirstname(value);
    setFirstnameError(!nameRegex.test(value));
  };

  const handleLastnameChange = (e) => {
    const value = e.target.value;
    setLastname(value);
    setLastnameError(!value || value.length < 3); // Assuming you want at least 3 characters
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNicknameError(!value || value.length < 3); // Assuming you want at least 3 characters
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !firstname ||
      !lastname ||
      !name ||
      !phone ||
      !email ||
      !password ||
      !province ||
      !language ||
      !service ||
      !qualification ||
      !fieldQualification ||
      firstnameError ||
      lastnameError ||
      nicknameError ||
      phoneError ||
      emailError ||
      passwordError ||
      provinceError ||
      languageError ||
      serviceError ||
      qualificationError ||
      fieldQualificationError
    ) {
      // Set error messages if any field is empty or has an error
      setErrorMessage("Please Validate Feilds First!");
      setError(true);
    } else {
      try {
        const response = await axios.post("/native/signUpNative", {
          name: name,
          fname: firstname,
          lname: lastname,
          email: email,
          pnum: phone,
          pass: password,
          province: province,
          language: language,
          service: service,
          qualification: qualification,
          city: city,
          feild_qualification: fieldQualification,
        });

        console.log(response);

        if (response.data === "Verification code sent to email.") {
          // Clear form fields on successful submission
          clearTextBox();
          console.log(isOpen);
          // Navigate to the next page
          toggleModal();
        }
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };

  const clearTextBox = () => {
    setFirstname("");
    setLastname("");
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setProvince("");
    setLanguage("");
    setService("");
    setQualification("");
    setFieldQualification("");
  };

  return (
    <div>
      <section className="h-100 py-5 gradient-form" style={{ ...sectionStyle, backgroundColor: "#E0E5EC" }}>
        <div className="container h-100" >
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-12 col-lg-12">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4"></div>
                  </div>
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center center">
                        <div className="center">
                          <img
                            src={logo}
                            style={{
                              width: "75px",
                              alignItems: "center",
                              display: "block",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                            alt="logo"
                          />
                        </div>
                        <h4 className="mt-1 mb-5 pb-1">
                          We are The CultureConnect Team
                        </h4>
                      </div>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {errorMessage}
                        </div>
                      )}
                      <form action="" onSubmit={handleSignup}>
                        <p>Please Signup to your account</p>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            First Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="form2Example11"
                            className={`form-control ${
                              firstnameError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter First Name"
                            required
                            value={firstname}
                            onChange={handleFirstnameChange}
                          />
                          {firstnameError && (
                            <div className="invalid-feedback">
                              First name must be at least 3 characters long.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Last Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="form2Example11"
                            className={`form-control ${
                              lastnameError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter Last Name"
                            required
                            value={lastname}
                            onChange={handleLastnameChange}
                          />
                          {lastnameError && (
                            <div className="invalid-feedback">
                              Lat name must be at least 3 characters long.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Nick Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="form2Example11"
                            className={`form-control ${
                              nicknameError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter Nick Name"
                            required
                            value={name}
                            onChange={handleNicknameChange}
                          />
                          {nicknameError && (
                            <div className="invalid-feedback">
                              Nick name must be at least 3 characters long.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Phone Number<span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            id="form2Example11"
                            className={`form-control ${
                              phoneError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter Phone no"
                            required
                            value={phone}
                            onChange={handlePhoneChange}
                          />
                          {phoneError && (
                            <div className="invalid-feedback">
                              Enter number in format 03XXXXXXXXX.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            id="form2Example11"
                            className={`form-control ${
                              emailError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter Email"
                            required
                            value={email}
                            onChange={handleEmailChange}
                          />
                          {emailError && (
                            <div className="invalid-feedback">
                              Please enter a valid email address. (e.g.,
                              example@gmail.com or f000000@cfd.nu.edu.pk).
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label
                            className="form-label"
                            htmlFor="form2Example22"
                          >
                            Password<span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            id="form2Example22"
                            placeholder="Enter Password"
                            className={`form-control ${
                              passwordError ? "is-invalid" : ""
                            }`}
                            required
                            value={password}
                            onChange={handlePasswordChange}
                          />
                          {passwordError && (
                            <div className="invalid-feedback">
                              Please enter a valid password with at least 6
                              characters, including 1 alphabetic, 1 special
                              character, and 1 numeric.
                            </div>
                          )}
                        </div>

                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            City<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${
                              cityError ? "is-invalid" : ""
                            }`}
                            id="form2Example11"
                            required
                            value={city}
                            onChange={(e) => handleCityChange(e)}
                          >
                            <option>Select City</option>
                            <option>Abbottabad</option>
                            <option>Attock</option>
                            <option>Bahawalnagar</option>
                            <option>Bahawalpur</option>
                            <option>Burewala</option>
                            <option>Chaman</option>
                            <option>Chiniot</option>
                            <option>Dera Ghazi Khan</option>
                            <option>Dera Ismail Khan</option>
                            <option>Faisalabad</option>
                            <option>Fateh Jang</option>
                            <option>Gawadar</option>
                            <option>Gujranwala</option>
                            <option>Gujrat</option>
                            <option>Haripur</option>
                            <option>Hyderabad</option>
                            <option>Islamabad</option>
                            <option>Jacobabad</option>
                            <option>Jhang</option>
                            <option>Jhelum</option>
                            <option>Karachi</option>
                            <option>Kasur</option>
                            <option>Khairpur</option>
                            <option>Khanewal</option>
                            <option>Kharian</option>
                            <option>Khuzdar</option>
                            <option>Kohat</option>
                            <option>Lahore</option>
                            <option>Larkana</option>
                            <option>Mardan</option>
                            <option>Mingora (Swat)</option>
                            <option>Mirpur</option>
                            <option>Multan</option>
                            <option>Murree</option>
                            <option>Muzaffarabad</option>
                            <option>Nawabshah</option>
                            <option>Nowshera</option>
                            <option>Okara</option>
                            <option>Peshawar</option>
                            <option>Quetta</option>
                            <option>Rahim Yar Khan</option>
                            <option>Rawalpindi</option>
                            <option>Sahiwal</option>
                            <option>Sargodha</option>
                            <option>Sheikhupura</option>
                            <option>Sialkot</option>
                            <option>Sukkur</option>
                            <option>Toba Tek Singh</option>
                            <option>Vehari</option>
                            <option>Zhob</option>
                          </select>
                          {cityError && (
                            <div className="invalid-feedback">
                              Please select a city.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Province<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${
                              provinceError ? "is-invalid" : ""
                            }`}
                            id="form2Example11"
                            required
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                          >
                            <option>Select Province</option>
                            <option>Punjab</option>
                            <option>Sindh</option>
                            <option>Khyber Pakhtunkhwa</option>
                            <option>Balochistan</option>
                          </select>
                          {provinceError && (
                            <div className="invalid-feedback">
                              Please select a province.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Language<span className="text-danger">*</span>
                          </label>

                          <select
                            className={`form-select ${
                              languageError ? "is-invalid" : ""
                            }`}
                            aria-label="Default select example"
                            required
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                          >
                            <option>Select Language</option>
                            <option>Urdu</option>
                            <option>Punjabi</option>
                            <option>Saraiki</option>
                            <option>Pashto</option>
                            <option>Balochi</option>
                            <option>Sindhi</option>
                            <option>Hindko</option>
                            <option>Brahui</option>
                          </select>
                          {languageError && (
                            <div className="invalid-feedback">
                              Please select a language.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Service<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="form2Example11"
                            className={`form-control ${
                              serviceError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter the Provided Service"
                            required
                            value={service}
                            onChange={(e) => handleServiceChange(e)}
                          />
                          {serviceError && (
                            <div className="invalid-feedback">
                              Please enter what kind of service you will be providing. Be specific as this will be representing on you profile.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Qualification<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${
                              qualificationError ? "is-invalid" : ""
                            }`}
                            aria-label="Default select example"
                            required
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                          >
                            <option>Select Qualification</option>
                            <option>Intermediate</option>
                            <option>BS</option>
                            <option>MS</option>
                            <option>Phd</option>
                          </select>
                          {qualificationError && (
                            <div className="invalid-feedback">
                              Please select a qualification.
                            </div>
                          )}
                        </div>
                        <div className="form-outline mb-3">
                          <label className="form-label" htmlFor="NativeSignup">
                            Field<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="form2Example22"
                            placeholder="Enter Field"
                            className={`form-control ${
                              fieldQualificationError ? "is-invalid" : ""
                            }`}
                            value={fieldQualification}
                            onChange={(e) => handleFieldQualificationChange(e)}
                          />
                          {fieldQualificationError && (
                            <div className="invalid-feedback">
                              what kind of service feild you are expert in? Be specific as this will be representing on you profile.
                            </div>
                          )}
                        </div>
                        <div className="text-center pt-1 mb-5 pb-1">
                          <button
                            type="submit"
                            style={{
                              backgroundColor: "#007bff",
                              borderColor: "#007bff",
                              color: "#fff",
                            }}
                            class="btn btn mt-3"
                            //onClick={() => navigate("/native/NativeSignup2")}
                          >
                            SignUp
                          </button>
                          <p className="text-gray-500 text-center m-4">
                            Already Registered?{" "}
                            <button
                              onClick={() => navigate("/native/NativeSignin")}
                              type="button"
                              className="text-blue-500 hover:text-blue-700 underline p-1"
                            >
                              LogIn
                            </button>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isOpen && (
        <EmailVerification
          isOpen={isOpen}
          onClose={toggleModal}
          role={"native"}
        />
      )}
    </div>
  );
}
