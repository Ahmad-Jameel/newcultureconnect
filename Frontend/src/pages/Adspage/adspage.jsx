import React, { useState } from "react";
import pic1 from "../../assets/gray3.png";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

export default function Adspage() {
  const [profilePic, setProfilePic] = useState(pic1);
  const [fileTypeError, setFileTypeError] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [formError, setFormError] = useState("");
  const [fileType, setFileType] = useState("image");
  const navigate = useNavigate();

  const displaySelectedImage = (event) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const allowedTypes = ["image/", "video/", "image/gif"];
      if (allowedTypes.some((type) => file.type.startsWith(type))) {
        setFileTypeError("");
        const reader = new FileReader();
        reader.onload = function (e) {
          setProfilePic(e.target.result);
          if (file.type.startsWith("video/")) {
            setFileType("video");
          } else {
            setFileType("image");
          }
        };
        reader.readAsDataURL(file);
      } else {
        setFileTypeError("Please select an image, video, or GIF.");
      }
    }
  };

  const validateForm = () => {
    if (
      !profilePic ||
      selectedDuration === "" ||
      adTitle.split(" ").length < 2
    ) {
      setFormError("Please fill all fields correctly.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleAddAd = () => {
    if (validateForm()) {
      const formData = new FormData();
      const fileInput = document.getElementById("customFile1");

      if (fileInput.files[0]) {
        formData.append("AdsGif", fileInput.files[0]);
      }

      formData.append("title", adTitle);
      formData.append("duration", selectedDuration);

      // Replace 'http://localhost:5000' with your actual backend server URL
      const url = "http://localhost:5000/admin/add_ads";

      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Ad added successfully:", response.data);

          // Handle success response, maybe clear form or show a success message
        })
        .catch((error) => {
          console.error("Error adding ad:", error.response);
          // Handle error, show error message to the user
        });
    }
    navigate("/adminfeedback");
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6 text-center">
            <h1 className="my-5" style={{ fontSize: 38 }}>
              Advertise with Us
            </h1>
            <hr />
            <h4
              className="mb-4 mt-5 text-center text-dark"
              style={{ fontSize: "38px" }}
            >
              Ads pic
            </h4>
            <div className="mb-4 d-flex justify-content-center">
              {fileType === "image" ? (
                <img
                  id="selectedImage1"
                  src={profilePic}
                  alt="Ad"
                  style={{ width: "500px", height: "400px" }}
                />
              ) : (
                <video controls style={{ width: "400px", height: "400px" }}>
                  <source src={profilePic} type="video/mp4" />{" "}
                  {/* Adjust type based on actual video format */}
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="d-flex justify-content-center">
              <div className="btn btn-primary btn-rounded">
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
                  onChange={displaySelectedImage}
                  accept="image/*,video/*,image/gif"
                />
              </div>
            </div>
            {fileTypeError && (
              <div className="text-center text-danger mt-2">
                {fileTypeError}
              </div>
            )}
            <div className="d-flex justify-content-center mt-4">
              <input
                type="text"
                className="form-control"
                id="adTitle"
                placeholder="Ad Title"
                aria-label="Ad Title"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
              />
            </div>
            <label className="form-label text-center mt-5" htmlFor="Adds">
              Duration<span className="text-danger">*</span>
            </label>
            <select
              className="form-select mb-5"
              aria-label="Default select example"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              <option value="">Select Duration</option>
              <option value="1 Day">1 Day</option>
              <option value="1 week">1 week</option>
              <option value="15 days">15 days</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="5 months">5 months</option>
              <option value="1 Year">1 Year</option>
            </select>
            {formError && (
              <div className="text-center text-danger mt-2">{formError}</div>
            )}
            <button
              className={`btn btn-lg mx-2 ${
                profilePic !== pic1 &&
                selectedDuration &&
                adTitle.split(" ").length >= 2
                  ? "btn-primary"
                  : "btn-light"
              }`}
              onClick={handleAddAd}
              disabled={
                !(
                  profilePic !== pic1 &&
                  selectedDuration &&
                  adTitle.split(" ").length >= 2
                )
              }
            >
              <b>Add Ads</b>
            </button>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  );
}
