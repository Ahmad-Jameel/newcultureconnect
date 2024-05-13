import React, { useState, useRef, useEffect } from "react";
import axios from "../../axios";
import greypic from "../../assets/grey.jpeg";
import img1 from "../../assets/door.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";


export default function UpdatePost() {
  const {user} = useContext(UserContext);
  console.log('Users Role', user.roles);

  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [fileType, setFileType] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id, caption, picture, type } = useLocation().state;
  
  const setData = () => {
    setDescription(caption || "");
    setFileType(type);
    if (type === "image") {
      setSelectedImage(`http://127.0.0.1:5000/${picture}`);
      setSelectedVideo(null);
    } else if (type === "video") {
      setSelectedVideo(`http://127.0.0.1:5000/${picture}`);
      setSelectedImage(null);
    }
  };

  function displaySelectedFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const determinedFileType = file.type.startsWith("image")
      ? "image"
      : "video";

    reader.onload = function (e) {
      if (determinedFileType === "image") {
        setSelectedImage(e.target.result);
        setSelectedVideo(null);
      } else {
        setSelectedVideo(e.target.result);
        setSelectedImage(null);
      }
      setFileType(determinedFileType);
    };

    reader.readAsDataURL(file);
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  useEffect(() => {
    console.log({ id, caption, picture, type }); // Add this line for debugging
    setData();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("id", id);
    formData.append("caption", description);
  
    const file = fileInputRef.current.files[0];
    if (file) {
      if (type === "image") {
        formData.append("image", file);
      } else if (type === "video") {
        formData.append("video", file);
      }
    } else {
      if (type === "image") {
        formData.append("existingImagePath", picture);
      } else if (type === "video") {
        formData.append("existingVideoPath", picture); 
      }
    }
  
    if(user.roles == "native"){
    try {
      const updateEndpoint = type === "image" ? "/native/update_image_post" : "/native/update_video_post";
      const response = await axios.put(updateEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      console.log(response.data);
      if(response.data === "Successfully updated record for the image." || response.data === "Successfully updated record for the video."){
        navigate('/user/userprofile');
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.response.data);
    }
  }else{
    try {
      const updateEndpoint = type === "image" ? "/user/update_image_post" : "/user/update_video_post";
      const response = await axios.put(updateEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      console.log(response.data);
      if(response.data === "Successfully updated record for the image." || response.data === "Successfully updated record for the video."){
        navigate('/user/userprofile');
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.response.data);
    }

  }
  };
  
  

  const fileInputStyle = {
    display: "none",
  };

  const previewStyle = {
    width: "500px",
    height: "auto",
  };

  const formcontentaddpost = {
    
    width: "80%",
    maxWidth:'500px',
    margin: "0 auto",
    padding: "0.5rem 1rem",
    fontSize: "0.9375rem",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "#29292e",
    marginLeft: "63px",
    backgroundColor: "#fff",
    border: "1px solid #e5dfe4",
    borderRadius: "5px",
  };

  return (
    <div>
      <div
        className="container-fluid"
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: "cover",
        }}
      >
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            <h1 className="mx-5 my-5 text-light" style={{ fontSize: "38px" }}>
              Update Post
            </h1>
            <hr className="text-light bg-light" />
            <form
              method="post"
              action="/upload"
              enctype="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div
                className="my-5"
                style={{
                  border: "1px solid black",
                  padding: '80px 20px 40px',
                  backgroundColor: "#FFFFF0",
                  borderRadius: "5px",
                }}
              >
                {(selectedImage || selectedVideo) && (
                  <div className="mb-4 d-flex justify-content-center">
                    {fileType === "image" && (
                      <img
                        src={selectedImage || greypic}
                        alt="Selected"
                        style={previewStyle}
                      />
                    )}
                    {fileType === "video" && (
                      <video controls style={previewStyle}>
                        <source src={selectedVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
                <div className="d-flex justify-content-center">
                  <label
                    className="btn btn-primary btn-rounded m-1"
                    htmlFor="customFile"
                  >
                    Choose file
                    <input
                      type="file"
                      className="form-control d-none"
                      id="customFile"
                      accept="image/*,video/*"
                      onChange={displaySelectedFile}
                      style={fileInputStyle}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
                <br />
                <br />
                <div>
                  <label className="form-label text-center" htmlFor="">
                    <h3>
                      <b>Add Description</b>
                    </h3>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={formcontentaddpost}
                    placeholder="Enter Your Description"
                    aria-label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className="gap-1 d-md-flex justify-content-md-center text-center">
                  <button
                    type="submit"
                    className="btn btn-primary my-5 btn-lg text-dark"
                    style={{ width: "100%" }}
                  >
                    UPDATE POST
                  </button>
                </div>
              </div>
            </form>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}