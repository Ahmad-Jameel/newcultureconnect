import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function ArticlePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postType, Reported_Post_ID } = location.state || {};

  const [blogData, setBlogData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get("/admin/get_reported_user_post_by_id", {
          params: { postType: postType, id: Reported_Post_ID },
        });
        console.log("------------find admin blogs data", response.data);
        if (response.data && response.data.Imagedata && response.data.email) {
          setBlogData(response.data.Imagedata);
          setUserData(response.data.email);
          setUserEmail(response.data.email.Email); // Set user email from response
        }
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      }
    };

    if (postType && Reported_Post_ID) fetchBlogData();
  }, [postType, Reported_Post_ID]);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleDelete = async () => {
    console.log("Delete button clicked");
  console.log("Current feedback value:", feedback); // Check the current state of feedback

  if (!feedback) {
    console.log("No feedback selected, should show alert."); // Confirm this log appears
    alert("Please select a feedback option before deleting.");
    return; // Exit the function if no feedback is selected
  }
  
    try {
      const queryParams = new URLSearchParams({
        id: Reported_Post_ID,
        postype: postType,
        email: userEmail, 
        name: userData.Name,
        date: new Date(blogData.createdAt).toISOString(),
        postcategory: feedback,
      });
  
      await axios.delete(`/admin/deletepost?${queryParams.toString()}`);
      alert("Post deleted successfully");
      navigate('/adminfeedback');
    } catch (error) {
      console.error("Failed to delete the post:", error);
      alert("Failed to delete the post");
    }
  };
  

  const deleteButtonStyle = {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
  };

  // Mimic hover effect in CSS if you are using external stylesheets or styled-components

  if (!blogData || !userData) {
    return <p>Loading...</p>;
  }

  const blogContentParts = blogData.Blog_Content.split(/\r\n\r\n/);

  return (
    <div>
      <div className="feedback-container" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px", marginBottom: "20px" }}>
        <input
          type="email"
          value={userEmail}
          readOnly
          style={{
            marginBottom: "10px",
            width: "300px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <select
          className="form-select"
          value={feedback}
          onChange={handleFeedbackChange}
          style={{
            width: "300px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            height: "44px",
            background: "white",
            color: "#495057",
          }}
        >
          <option value="" disabled>Select Issue / Report</option>
          <option value="Hate Speech">Hate Speech</option>
          <option value="Nudity or Sexual Content">Nudity or Sexual Content</option>
          <option value="Unauthorized Sale">Unauthorized Sale</option>
          <option value="Harassment">Harassment</option>
          <option value="Fraud or Scam">Fraud or Scam</option>
          <option value="Violence">Violence</option>
          <option value="Something Else">Something Else</option>
        </select>
        <button className="my-2"
          onClick={handleDelete} 
          style={deleteButtonStyle} 
          disabled={!feedback} // Button is disabled if feedback is not selected
        >
          Delete Post
        </button>
      </div>
      <h1
            className="mb-3 title mb-xl-4 text-uppercase text-center my-2"
            style={{ fontSize: "38px" }}
          >
            Reported Blog
          </h1>
      <article className="mb-10">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7">
            <h1 className="my-4" style={{fontSize: 32}}><b>{blogData.Blog_Title}</b></h1>
            <img style={{ borderRadius: "70px" }} 
                className="img-fluid py-3"
                src={`http://localhost:5000/${blogData.Blog_Title_Image}`}
                alt="Blog Title"
              />
              {blogContentParts.map((part, index) => (
                <p key={index} style={{ fontSize: "24px" }}>{part}</p>
              ))}
              {blogData.Blog_Content_Image && (
                <img style={{ borderRadius: "70px" }}
                  className="img-fluid py-3"
                  src={`http://localhost:5000/${blogData.Blog_Content_Image}`}
                  alt="Blog Content"
                />
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
  

}
