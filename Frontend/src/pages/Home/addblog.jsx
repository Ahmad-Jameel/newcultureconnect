import pic1 from "../../assets/gray3.png";
import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed
import { useNavigate } from "react-router-dom";

export default function addblog() {
  const navigate = useNavigate();

  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [titleImage, setTitleImage] = useState(null);
  const [contentImage, setContentImage] = useState(null);

  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [titleImageError, setTitleImageError] = useState("");
  const [contentImageError, setContentImageError] = useState("");

  function displaySelectedImage(
    event,
    elementId,
    setImageState,
    setErrorState
  ) {
    const selectedImage = document.getElementById(elementId);
    const file = event.target.files[0];

    if (file && !file.type.startsWith("image/")) {
      setErrorState("Please select an image file.");
      return; // Stop further execution
    } else {
      setErrorState(""); // Clear any previous error messages
    }

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        selectedImage.src = e.target.result;
      };

      reader.readAsDataURL(file);
      setImageState(file); // Update the state with the file
    }
  }

  async function handleSubmit(e) {
    const UserID = JSON.parse(localStorage.getItem("user")).id;
    console.log(UserID);

    e.preventDefault(); // Prevent default form submission behavior

    // Validation here if needed

    let isValid = true; // Flag to track overall form validity

    // Reset error messages
    setTitleError("");
    setContentError("");
    setTitleImageError("");
    setContentImageError("");

    // Validate title word count
    if (blogTitle.split(" ").filter(Boolean).length < 5) {
      setTitleError("Title must contain at least 5 words.");
      isValid = false;
    }

    // Validate content word count
    if (blogContent.split(" ").filter(Boolean).length < 50) {
      setContentError("Content must contain at least 50 words.");
      isValid = false;
    }

    // Check if any validation failed
    if (!isValid) return;

    const formData = new FormData();
    formData.append("BlogTitle", blogTitle);
    formData.append("blogContent", blogContent);
    formData.append("UserID", UserID);
    if (titleImage) formData.append("Blog_Title_Image", titleImage);
    if (contentImage) formData.append("Blog_Content_Image", contentImage);

    try {
      // Adjust URL as necessary
      const response = await axios.post(
        "http://localhost:5000/native/addblogs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      navigate("/user/Homepage"); // Handle success
    } catch (error) {
      console.error(error); // Handle error
    }
  }

  return (
    <>
      <div className="container my-5">
        <div className="row">
        <h1
            className="mb-3 title mb-xl-4 text-uppercase text-center my-2"
            style={{ fontSize: "38px" }}
          >
            Write with Us
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="col-sm-12">
              <label style={{fontSize:28}}>
                Blog Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                style={{border:"1px solid black"}}
                class="form-control"
                placeholder="Enter Blog Title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
              />
              {titleError && <div style={{ color: "red" }}>{titleError}</div>}
            </div>
            <div className="col-sm-12 mt-4">
              <label  style={{fontSize:28}} htmlFor="content" className="form-label">
                Content <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                style={{border:"1px solid black"}}
                id="content"
                placeholder="Enter Blog Content"
                name="content"
                rows="6"
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                required
              ></textarea>
              {contentError && (
                <div style={{ color: "red" }}>{contentError}</div>
              )}
            </div>
            <div className="row">
              <div className="col-sm-6 mt-4">
                <h4
                  className="mb-4 mt-0 form-label  text-dark"
                  style={{ fontSize: 28 }}
                >
                  Title Picture
                </h4>
                <div className="mb-4 ">
                  <img
                    id="selectedImage1"
                    src={pic1}
                    alt="example placeholder"
                    style={{ width: 720, height: 400, borderRadius:20 }}
                  />
                </div>
                <div className="">
                  <div className="btn btn-dark btn-rounded mb-5">
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
                        displaySelectedImage(
                          event,
                          "selectedImage1",
                          setTitleImage,
                          setTitleImageError
                        )
                      }
                    />
                    {titleImageError && (
                      <div style={{ color: "red" }}>{titleImageError}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-sm-6 mt-4">
                <h4
                  className="mb-4  text-dark"
                  style={{ fontSize: 28 }}
                >
                  Content Picture
                </h4>
                <div className="mb-4 ">
                  <img
                    id="selectedImage2"
                    src={pic1}
                    alt="example placeholder"
                    style={{ width: 720, height: 400, borderRadius:20 }}
                  />
                </div>
                <div className="">
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
                        displaySelectedImage(
                          event,
                          "selectedImage2",
                          setContentImage,
                          setContentImageError
                        )
                      }
                    />
                    {contentImageError && (
                      <div style={{ color: "red" }}>{contentImageError}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
            <button type="submit" className="btn btn-primary bg-primary  my-2 btn-lg" >Submit Blog</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
