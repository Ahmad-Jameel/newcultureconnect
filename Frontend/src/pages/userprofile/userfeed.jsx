import "../userprofile/userprofile.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "../../axios";
import logo from "../../assets/logo.png";
import pic2 from "../../assets/logo1.png";

export default function UserFeed() {
  const id = JSON.parse(localStorage.getItem("user")).id;

  const [profileImage, setProfileImage] = useState(pic2);
  const navigate = useNavigate();
  const [mappedMedia, setMappedMedia] = useState([]);
  const [reportOptionVisible, setReportOptionVisible] = useState({});
  const [commentBoxVisible, setCommentBoxVisible] = useState({});
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(null);

  const navigateToHomepage = () => {
    navigate("/user/Homepage");
  };

  const navigateToUserProfile = () => {
    navigate("/user/userprofile");
  };

  useEffect(() => {
    async function getInfo() {
      try {
        const response = await axios.get("/user/allsocialmediaposts", {
          params: { id: id },
        });

        const users = response.data.Userphoto;
        const combinedMedia = response.data.combinedMedia;

        const mappedMedia = combinedMedia.map((media) => {
          const user = users.find((user) => user.UserID === media.UserID);
          return { ...media, UserPhoto: user };
        });

        setMappedMedia(mappedMedia);

        console.log(response);
        console.log(mappedMedia);
        if (response.data.Userphoto[0].Profile_pic) {
          setProfileImage(
            `http://127.0.0.1:5000/${response.data.Userphoto[0].Profile_pic}`
          );
        } else {
          setProfileImage(pic2);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getInfo();
  }, []);

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const payload = {
        UserID: id,
        PostID: postId,
        Comment: commentText,
      };

      await axios.post("/user/Add_Comment", payload);

      setCommentText("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const navigateToOtherUserProfile = (userID) => {
    navigate("/OtherUserProfile", { state: { UserID: userID } });

    console.log("userid----------", userID);
  };

  const toggleReportOption = (postId) => {
    setReportOptionVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleCommentBox = async (postId) => {
    let isCommentsVisible = commentBoxVisible[postId];
    
    if (!isCommentsVisible) {
        const response = await axios.get("/user/fetch_all_comments", {
            params: {
                Post_ID: postId,
            },
        });

        const formattedComments = response.data.map((comment) => ({
            name: comment.CommenterName,
            comment: comment.Comment,
            createdAt: new Date(comment.createdAt).toDateString(),
        }));

        // Update comments for the specific post
        setComments(prev => ({ ...prev, [postId]: formattedComments }));
    }

    // Toggle visibility
    setCommentBoxVisible(prev => ({
        ...prev,
        [postId]: !prev[postId],
    }));
};


  const handleReportClick = (post) => {
    const postId = post.VideoID ? post.VideoID : post.ImageID;
    const postType = post.VideoID ? "video" : "image";
    navigate("/user/Feedback", { state: { postId, postType } });
  };

  return (
    <div style={{backgroundColor:"#385591"}}>
      <main>
        <header>
          <div className="tb">
            <div className="td" id="logo">
              <a
                className="navbar-brand px-lg-5 px-sm-2 d-flex align-items-center"
                href="#"
              >
                <img style={{ width: 40 }} src={logo} alt="" />
              </a>
            </div>
            <div className="td" id="search-form">
              <form method="get" action="#">
                <input type="text" placeholder="Search CultureConnect" />
                <button type="submit">
                  <i className="material-icons">
                    <ion-icon name="search-outline"></ion-icon>
                  </i>
                </button>
              </form>
            </div>
            <div className="td" id="f-name-l">
              <span>CultureConnect</span>
            </div>
            <div className="td" id="i-links">
              <div className="tb">
                <div className="td" id="m-td">
                  <div className="tb">
                    <span className="td" onClick={navigateToHomepage}>
                      <i className="material-icons">
                        <ion-icon name="home-outline"></ion-icon>
                      </i>
                    </span>
                  </div>
                </div>
                <div className="td">
                  <a href="#" id="p-link" onClick={navigateToUserProfile}>
                    <img src={pic2} alt="Profile" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div id="main-content">
          <div className="tb">
            <div className="td" id="l-col"></div>
            <div className="td" id="m-col">
              {/* <div className="m-mrg" id="p-tabs">
                <div className="tb">
                  <div className="td">
                    <div className="tb" id="p-tabs-m">
                      <div className="td active">
                        <i className="material-icons">
                          <ion-icon name="albums-outline"></ion-icon>
                        </i>
                        <span>Friends</span>
                      </div>
                      <div className="td" onClick={navigateToUserProfile}>
                        <i className="material-icons">
                          <ion-icon name="person-circle-outline"></ion-icon>
                        </i>
                        <span>My Profile</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {mappedMedia.map((post, index) => (
                <div key={post.id} className="post mt-5">
                  <div className="">
                    <a
                      href="#"
                      className="td" style={{width:50}}
                      onClick={() => navigateToOtherUserProfile(post.UserID)}
                    >
                      <img
                      style={{width:100, borderRadius:50}}
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
                        <a href="#">{post.UserPhoto.Name}</a>
                        <p>{post.img_caption || post.Captions}</p>
                      </div>
                      <div className="p-dt">
                        <i className="material-icons">
                          <ion-icon name="calendar-outline"></ion-icon>
                        </i>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                    <button className="btn btn-danger" onClick={() => handleReportClick(post)}>
                            Report
                    </button>
                    </div>
                    {/* <div className="td p-menu">
                      <button
                        className="p-menu-btn"
                        onClick={() => toggleReportOption(post.id)}
                      >
                        <i className="material-icons">
                          <ion-icon name="ellipsis-horizontal"></ion-icon>
                        </i>
                      </button>
                      {reportOptionVisible[post.id] && (
                        <div className="p-report-toggle">
                          <button onClick={() => handleReportClick(post)}>
                            Report
                          </button>
                        </div>
                      )}
                    </div> */}
                  </div>
                  <a href="#" className="p-cnt-v">
                    {post.picture && (
                      <img
                        src={`http://127.0.0.1:5000/${post.picture}`}
                        alt="Post"
                      />
                    )}
                    {post.Video && (
                      <video
                        controls
                        src={`http://127.0.0.1:5000/${post.Video}`}
                      ></video>
                    )}
                  </a>
                  <div className="p-acts">
                    {/* <div className="p-act like">
                      <i className="material-icons" style={{ fontSize: 22 }}>
                        <ion-icon name="heart"></ion-icon>
                      </i>
                      <span>25</span>
                    </div> */}
                    <div
                      className="p-act comment"
                      onClick={() =>
                        toggleCommentBox(post?.VideoID || post?.ImageID)
                      }
                    >
                      <i className="material-icons" style={{ fontSize: 22 }}>
                        <ion-icon name="chatbox"></ion-icon>
                      </i>
                      {/* <span>1</span> */}
                    </div>
                  </div>

                  {commentBoxVisible[post?.ImageID || post?.VideoID] && (
                    <div
                      className="bg-gray-100 p-6"
                      style={{ maxWidth: "100%" }}
                    >
                      <h2 className="text-lg font-bold mb-4">Comments</h2>
                      <div
                        className="flex flex-col space-y-4"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        {comments[post?.ImageID || post?.VideoID]?.map(
                          (comment, index) => (
                            <div
                              key={index}
                              className="bg-white p-4 rounded-lg shadow-md"
                            >
                              <h3 className="text-lg font-bold">
                                {comment.name}
                              </h3>
                              <p className="text-gray-700 text-sm mb-2">
                                {comment.createdAt}
                              </p>
                              <p className="text-gray-700">{comment.comment}</p>
                            </div>
                          )
                        )}
                        {/* Comment items
                        <div class="bg-white p-4 rounded-lg shadow-md">
                          <h3 class="text-lg font-bold">Jane Smith</h3>
                          <p class="text-gray-700 text-sm mb-2">
                            Posted on April 16, 2023
                          </p>
                          <p class="text-gray-700">
                            I agree with John. Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                          </p>
                        </div> */}

                        <form
                          className="bg-white p-4 rounded-lg shadow-md"
                          onSubmit={(e) =>
                            handleCommentSubmit(e, post.VideoID || post.ImageID)
                          }
                        >
                         
                          <div className="mb-4">
                            {/* Comment input */}
                           
                            <textarea
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="comment"
                              rows="3"
                              placeholder="Enter your comment"
                              value={commentText} // Bind the state to the textarea
                              onChange={(e) => setCommentText(e.target.value)} // Update the state on change
                            ></textarea>
                          </div>
                          <button
                            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit" // Specify the button type to submit
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="td" id="r-col"></div>
          </div>
        </div>
      </main>
    </div>
  );
}