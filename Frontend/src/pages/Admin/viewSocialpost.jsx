import "../userprofile/userprofile.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "../../axios";
import pic2 from "../../assets/profileIcon.png";
import { useLocation } from "react-router-dom";

export default function UserFeed() {
  const navigate = useNavigate();
  const [mappedMedia, setMappedMedia] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const [feedback, setFeedback] = useState("");

  const location = useLocation();
  const { postType, Reported_Post_ID } = location.state || {};

  console.log("--------------", postType, Reported_Post_ID);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  useEffect(() => {
    async function getInfo() {
      try {
        const response = await axios.get(
          "/admin/get_reported_user_post_by_id",
          {
            params: { postType: postType, id: Reported_Post_ID },
          }
        );
        console.log("-----------data from backend", response.data);

        // Set email from response
        if (response.data.email && response.data.email.Email) {
          setUserEmail(response.data.email.Email);
        }

        // Process and set media data
        if (response.data.Imagedata) {
          setMappedMedia([
            {
              ...response.data.Imagedata,
              UserPhoto: {
                Name: response.data.email.Name,
                Profile_pic: response.data.email.Profile_pic,
              },
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (postType && Reported_Post_ID) {
      getInfo();
    }
  }, [postType, Reported_Post_ID]);

  // const navigateToOtherUserProfile = (userID) => {
  //   navigate("/OtherUserProfile", { state: { UserID: userID } });

  //   console.log("userid----------", userID);
  // };

  const handleDelete = async (postId) => {
    try {
      // Assuming `mappedMedia` contains all the information you need
      const post = mappedMedia.find((p) => p.id === postId);
      if (!post) {
        console.error("Post not found");
        return;
      }
  
      // Format the date
      const date = new Date(post.createdAt).toISOString();
  
      // Construct the query parameters
      const queryParams = new URLSearchParams({
        id: Reported_Post_ID,
        postype: postType,
        email: userEmail, 
        name: post.UserPhoto.Name, // Assuming this is the name of the user
        date,
        postcategory: feedback, // feedback state holds the selected issue/report category
      });
  
      await axios.delete(`/admin/deletepost?${queryParams.toString()}`);

      const filteredPosts = mappedMedia.filter((p) => p.id !== postId);
      setMappedMedia(filteredPosts);
  
      alert("Post deleted successfully");
      navigate('/adminfeedback');

    } catch (error) {
      console.error("Failed to delete the post:", error);
      alert("Failed to delete the post");
    }
  };

  const deleteButtonStyle = {
    backgroundColor: "#ff4d4d", // Red
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
    float: "right",
    marginRight: "10px",
    marginTop: "10px",
  };

  const deleteButtonHoverStyle = {
    backgroundColor: "#ff0000", // Darker red
  };

  return (
    <div className="body3">
      <main>
        <div id="main-content">
          <div
            className="form-container"
            style={{
              display: "flex", // Use Flexbox
              justifyContent: "center", // Center items horizontally
              alignItems: "center", // Center items vertically (if needed)
              flexDirection: "column", // Stack children vertically
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <input
              type="email"
              value={userEmail}
              readOnly
              style={{
                marginBottom: "10px", // Add some space below the email field
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
              aria-label="Default select example"
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
              <option value="" disabled>
                Select Issue / Report
              </option>
              <option value="Hate Speech">Hate Speech</option>
              <option value="Nudity or Sexual Content">
                Nudity or Sexual Content
              </option>
              <option value="Unauthorized Sale">Unauthorized Sale</option>
              <option value="Harassment">Harassment</option>
              <option value="Fraud or Scam">Fraud or Scam</option>
              <option value="Violence">Violence</option>
              <option value="Something Else">Something Else</option>
            </select>
          </div>

          <div className="tb">
            <div className="td" id="l-col"></div>
            <div className="td" id="m-col">
              <div>
                {mappedMedia.map((post, index) => (
                  <div key={index} className="post">
                    <div className="post-actions">
                      <button
                        style={deleteButtonStyle}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor =
                            deleteButtonHoverStyle.backgroundColor)
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor =
                            deleteButtonStyle.backgroundColor)
                        }
                        onClick={() => handleDelete(post.id)}
                        disabled={!feedback} 
                      >
                        Delete
                      </button>
                    </div>
                    <div className="tb">
                      <a
                        href="#"
                        className="td p-p-pic"
                        //onClick={() => navigateToOtherUserProfile(post.UserID)}
                      >
                        <img
                          src={
                            post.UserPhoto.Profile_pic
                              ? `http://127.0.0.1:5000/${post.UserPhoto.Profile_pic}`
                              : pic2
                          }
                          alt={`${post.UserPhoto.Name}'s profile pic`}
                        />
                      </a>
                      <div className="td p-r-hdr">
                        <div className="p-u-info">
                          <p>{post.Captions}</p>
                          <a href="#">{post.UserPhoto.Name}</a>
                        </div>
                        <div className="p-dt">
                          <i className="material-icons">
                            <ion-icon name="calendar-outline"></ion-icon>
                          </i>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {postType === "image" && post.picture && (
                      <a href="#" className="p-cnt-v">
                        <img
                          src={`http://127.0.0.1:5000/${post.picture}`}
                          alt="Post"
                        />
                      </a>
                    )}
                    {postType === "video" && post.Video && (
                      <a href="#" className="p-cnt-v">
                        <video
                          controls
                          src={`http://127.0.0.1:5000/${post.Video}`}
                        />
                      </a>
                    )}
                    <div>
                      <div className="p-acts">
                        {/* <div className="p-act like">
                          <i
                            className="material-icons"
                            style={{ fontSize: 22 }}
                          >
                            <ion-icon name="heart"></ion-icon>
                          </i>
                          <span>25</span>
                        </div> */}
                        <div className="p-act comment">
                          <i
                            className="material-icons"
                            style={{ fontSize: 22 }}
                          >
                            <ion-icon name="chatbox"></ion-icon>
                          </i>
                          {/* <span>1</span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div id="loading">
                <i class="material-icons" style={{ fontSize: 30 }}>
                  <ion-icon name="refresh-circle-outline"></ion-icon>
                </i>
              </div>
            </div>
            <div className="td" id="r-col"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
