import React, { useEffect, useState } from "react";
import pic1 from "../../assets/grey.jpeg";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";

export default function EditProfile() {
  const {user} = useContext(UserContext);
  console.log('Users Role', user.roles);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePic, setProfilePic] = useState(pic1);
  const [bannerPic, setBannerPic] = useState(pic1);
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState(false);

  // Styles
  const formcontent = {
    display: "block",
    padding: '0.5rem 1rem',
    fontSize: "0.9375rem",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "#29292e",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    border: "1px solid #e5dfe4",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    borderRadius: "5px",
  };

  const displaySelectedImage = (event, setImage) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
  
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only pictures can be uploaded.");
        fileInput.value = ""; 
      } else {
        const reader = new FileReader();
        reader.onload = function (e) {
          setImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleNickNameChange = (event) => {
    setNickName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    const phoneRegex = /^03\d{9}$/;

    // Set the phone number in the state regardless of validation
    setPhoneNumber(value);

    // Check if the phone number doesn't start with 03 and its length is not zero
    if (!value.startsWith("03") && value.length !== 0) {
        setPhoneError(true);
        return; // Stop further execution if this condition is met
    }

    // Validate against the regex
    if (phoneRegex.test(value) || value === "") {
        setPhoneError(false);
    } else {
        setPhoneError(true);
    }
};


  useEffect(() => {
    
    async function getInfo() {

      if(user.roles == "native"){
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
          const response = await axios.get(
            "/native/display_userdatafior_update",
            {
              params: { id: user.id },
            }
          );

          setFirstName(response.data.FirstName);
          setLastName(response.data.LastName);
          setNickName(response.data.Name);
          setPhoneNumber(response.data.PhoneNumber);

          if (response.data.Cover_photo) {
            console.log(response.data.Cover_photo);
            setBannerPic(`http://127.0.0.1:5000/${response.data.Cover_photo}`);
          }
          if (response.data.Profile_pic) {
            console.log(response.data.Profile_pic);
            setProfilePic(`http://127.0.0.1:5000/${response.data.Profile_pic}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    else if(user.roles == "user"){
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
          const response = await axios.get(
            "/user/display_userdatafior_update",
            {
              params: { id: user.id },
            }
          );

          setFirstName(response.data.FirstName);
          setLastName(response.data.LastName);
          setNickName(response.data.Name);
          setPhoneNumber(response.data.PhoneNumber);

          if (response.data.Cover_photo) {
            console.log(response.data.Cover_photo);
            setBannerPic(`http://127.0.0.1:5000/${response.data.Cover_photo}`);
          }
          if (response.data.Profile_pic) {
            console.log(response.data.Profile_pic);
            setProfilePic(`http://127.0.0.1:5000/${response.data.Profile_pic}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    }

    getInfo();
  }, []);

  const handleSubmission = async () => {
    if(user.roles == "native"){
    try {

      
      const formData = new FormData();
      formData.append("name", nickName);
      formData.append("fname", firstName);
      formData.append("lname", lastName);
      formData.append("pnum", phoneNumber);

      const nameRegex = /^[A-Za-z]{3,}[0-9]*$/;
      const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert("Phone number must start with 03 and be 11 digits long.");
        return; 
    }

      if (!nameRegex.test(firstName)) {
        alert('First Name should start with at least 3 letters');
        return;
      }
      if (!nameRegex.test(lastName)) {
        alert('Last Name should start with at least 3 letters');
        return;
      }
      if (!nameRegex.test(nickName)) {
        alert('Nickname should start with at least 3 letters.');
        return;
      }

      const profileImageElement = document.getElementById("customFile1");
      const coverImageElement = document.getElementById("customFile2");

      if (profileImageElement && profileImageElement.files[0]) {
        formData.append("profile_image", profileImageElement.files[0]);
      }

      if (coverImageElement && coverImageElement.files[0]) {
        formData.append("cover_image", coverImageElement.files[0]);
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        formData.append("id", user.id);
      }

      const response = await axios.put("/native/upadte_userprofile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === "Data updated successfully") {
        navigate('/user/userprofile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }
  else{
    try {

      
      const formData = new FormData();
      formData.append("name", nickName);
      formData.append("fname", firstName);
      formData.append("lname", lastName);
      formData.append("pnum", phoneNumber);

      const nameRegex = /^[A-Za-z]{3,}[0-9]*$/;
      const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert("Phone number must start with 03 and be 11 digits long.");
        return; 
    }

      if (!nameRegex.test(firstName)) {
        alert('First Name should start with at least 3 letters');
        return;
      }
      if (!nameRegex.test(lastName)) {
        alert('Last Name should start with at least 3 letters');
        return;
      }
      if (!nameRegex.test(nickName)) {
        alert('Nickname should start with at least 3 letters.');
        return;
      }

      const profileImageElement = document.getElementById("customFile1");
      const coverImageElement = document.getElementById("customFile2");

      if (profileImageElement && profileImageElement.files[0]) {
        formData.append("profile_image", profileImageElement.files[0]);
      }

      if (coverImageElement && coverImageElement.files[0]) {
        formData.append("cover_image", coverImageElement.files[0]);
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        formData.append("id", user.id);
      }

      const response = await axios.put("/user/upadte_userprofile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === "Data updated successfully") {
        navigate('/user/userprofile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }
  };


  const handleCancel = () => {
    navigate('/user/userprofile')
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="my-5 mx-2 text-dark text-center">
            <h1
            className="mb-3 title mb-xl-4 text-uppercase text-center my-2"
            style={{ fontSize: "38px" }}
          >
           Update Profile
          </h1>
            
            </div>

            <form className="file-upload p-3 mb-3" style={{borderRadius:30, border:"1px solid black"}} >
              <div className="row gx-2">
                <div className="col-md-12">
                  <div
                    className="bg-secondary-soft px-4 py-5 rounded mx-5"
                    
                  >
                    <div className="g-3 mx-5">
                      <h4
                        className="mb-4 mt-0 text-dark"
                        style={{ fontSize: "38px" }}
                      >
                        Contact detail
                      </h4>
                      <div className="col-md-12 text-dark">
                        <label className="form-label mt-3">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          style={formcontent}
                          placeholder="Enter First Name"
                          aria-label="First name"
                          value={firstName}
                          onChange={handleFirstNameChange}
                        />
                      </div>
                      <div className="col-md-12 text-dark">
                        <label className="form-label mt-3">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          style={formcontent}
                          placeholder="Enter Last Name"
                          aria-label="Last name"
                          value={lastName}
                          onChange={handleLastNameChange}
                        />
                      </div>
                      <div className="col-md-12 text-dark">
                        <label className="form-label mt-3">Nick Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          style={formcontent}
                          placeholder="Enter Nick Name"
                          aria-label="Nick name"
                          value={nickName}
                          onChange={handleNickNameChange}
                        />
                      </div>
                      <div className="col-md-12 text-dark">
                        <label className="form-label mt-3">Phone number *</label>
                        <input
                          type="text"
                          className="form-control"
                          style={formcontent}
                          placeholder="Enter Phone no."
                          aria-label="Phone number"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange} 
                        />
                        {phoneError && <div style={{ color: "#22C55E" }}>Enter number in format 03XXXXXXXXX.</div>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-5">
                  <h4
                    className="mb-4 mt-5 text-center text-dark"
                    style={{ fontSize: "38px" }}
                  >
                    Profile pic
                  </h4>
                  <div className="mb-4 d-flex justify-content-center">
                    <img
                      id="selectedImage1"
                      src={profilePic}
                      alt="Profile"
                      style={{ width: "300px", height: "300px", borderRadius:30}}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <div className="btn btn-dark btn-rounded">
                      <label
                        className="form-label text-white m-1"
                        htmlFor="customFile1"
                      >
                        Choose file
                      </label>
                      <input
                        type="file"
                        className="form-control d-none"
                        id="customFile1"
                        onChange={(event) =>
                          displaySelectedImage(event, setProfilePic)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h4
                    className="mb-4 mt-5 text-center text-dark"
                    style={{ fontSize: "38px" }}
                  >
                    Banner Picture
                  </h4>
                  <div className="mb-4 d-flex justify-content-center mr-3">
                    <img
                      id="selectedImage2"
                      src={bannerPic}
                      alt="Banner"
                      style={{ width: "1100px", height: "300px",  borderRadius:30 }}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <div className="btn btn-dark btn-rounded">
                      <label
                        className="form-label text-white m-1"
                        htmlFor="customFile2"
                      >
                        Choose file
                      </label>
                      <input
                        type="file"
                        className="form-control d-none"
                        id="customFile2"
                        onChange={(event) =>
                          displaySelectedImage(event, setBannerPic)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="gap-1 d-md-flex mt-5 justify-content-md-end text-center">
                <button
                  type="button"
                  className="btn btn-danger btn-lg bg-danger mx-2"
                  onClick={handleCancel}
                >
                 <b> Cancel </b>
                </button>
                <button
                  type="button"
                  className="btn btn-primary bg-primary btn-lg mx-2"
                  onClick={handleSubmission}
                >
                 <b> Update profile </b>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}