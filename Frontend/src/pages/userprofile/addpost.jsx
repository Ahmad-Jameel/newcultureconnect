import React, { useState, useRef, useEffect } from 'react';
import axios from '../../axios';
import greypic from '../../assets/grey.jpeg';
import img1 from '../../assets/door.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";

export default function AddPost() {

  const {user} = useContext(UserContext);
  console.log('Users Role', user.roles);


  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const uploadType = location.state?.uploadType;

  useEffect(() => {
    if (!['image', 'video'].includes(uploadType)) {
      setError('Invalid upload type');
    } else {
      setFileType(uploadType); 
    }
  }, [uploadType]);

  function displaySelectedFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image');
    const isVideo = file.type.startsWith('video');

    if ((fileType === 'image' && !isImage) || (fileType === 'video' && !isVideo)) {
      setError(`Please select a ${fileType}.`);
      setSelectedImage(null);
      setSelectedVideo(null);
      return;
    }

    setError("");
    const reader = new FileReader();

    reader.onload = function (e) {
      if (isImage) {
        setSelectedImage(e.target.result);
        setSelectedVideo(null);
      } else if (isVideo) {
        setSelectedVideo(e.target.result);
        setSelectedImage(null);
      }
    };

    reader.readAsDataURL(file);
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

  if (!selectedImage && !selectedVideo) {
    alert('No file chosen. Please select a file.');
    return;
  }
    const id = (JSON.parse(localStorage.getItem('user'))).id;
    console.log(id);
    const formData = new FormData();
    if (fileType === 'image') {
      formData.append('image', fileInputRef.current.files[0]);
      formData.append('caption', description);
      formData.append('id', id);

      if(user.roles == "native"){
      try {
        const response = await axios.post('/native/add_imagepost', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        if(response.data==="Successfully added record for the uploaded image.")
        {
          navigate('/user/userprofile');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }else{
      try {
        const response = await axios.post('/user/add_imagepost', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        if(response.data==="Successfully added record for the uploaded image.")
        {
          navigate('/user/userprofile');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }

    }


    } else if (fileType === 'video') {
      formData.append('video', fileInputRef.current.files[0]);
      formData.append('text', description);
      formData.append('id', id);


      if(user.roles == "native"){
      try {
        const response = await axios.post('/native/add_videopost', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        if(response.data==="Successfully added record for the video.")
        {
          navigate('/user/userprofile');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    } else{
      try {
        const response = await axios.post('/user/add_videopost', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        if(response.data==="Successfully added record for the video.")
        {
          navigate('/user/userprofile');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }

    }
    }
  };

  const fileInputStyle = {
    display: 'none',
  };

  const previewStyle = {
    width: '80%',
    height: 'auto',
    maxWidth: '80%',
    borderRadius:30
  };

  const formcontentaddpost = {
    width: '80%',
    padding: '0.5rem 1rem',
    fontSize: '0.9375rem',
    fontWeight: 400,
    lineHeight: 1.6,
    color: '#29292e',
    backgroundColor: '#fff',
    border: '1px solid #e5dfe4',
    borderRadius: '5px',
  };

  return (
    <div>
      <div
        className="container"
        
      >
        <div className="row justify-content-center">
          <div className="col-10 col-md-8 col-lg-6 text-center">
          <h1
            className="mb-3 title mb-xl-4 text-uppercase text-center mt-5 "
            style={{ fontSize: "38px" }}
          >
          Create Post
          </h1>
            <hr className='text-light bg-light'/>
            <form method="post" action="/upload"  enctype="multipart/form-data" onSubmit={handleSubmit}>
              <div className='my-5  p-5 py-4' style={{ border: '3px dotted black', borderRadius: '30px' }}>
                {(selectedImage || selectedVideo) && (
                  <div className="mb-4 d-flex justify-content-center">
                    {fileType === 'image' && <img src={selectedImage || greypic} alt="Selected" style={previewStyle} />}
                    {fileType === 'video' && (
                      <video controls style={previewStyle}>
                        <source src={selectedVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
                <div className="d-flex justify-content-center">
                  <label className="btn btn-primary btn-rounded m-1" htmlFor="customFile">
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
                <br /><br />
                <div>
                  {error && <h3 className='text-danger'>{error}</h3>}
                  <label className="form-label text-center" htmlFor="">
                    <h3><b>Add Description</b></h3> 
                  </label>
                  <input 
                    type="text"
                    className="form-control mx-auto"
                    style={formcontentaddpost}
                    placeholder="Enter Your Description"
                    aria-label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-dark my-3 bg-dark">ADD POST</button>
                </div>
              </div>
            </form>
            <br /><br />
          </div>
        </div>
      </div>
    </div>
  );
}
