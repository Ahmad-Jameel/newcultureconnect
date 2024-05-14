import React, { useState, useEffect, useContext } from "react";
import "../userprofile/userprofile.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import logo from "../../assets/logo.png";
import pic1 from "../../assets/profileIcon.png";
import pic2 from "../../assets/profileIcon.png";

export default function UserProfile() {
  const { user } = useContext(UserContext);
  console.log("Users Role", user.roles);

  const [bannerImage, setBannerImage] = useState(pic1);
  const [profileImage, setProfileImage] = useState(pic2);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [commentBoxVisible, setCommentBoxVisible] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");

  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/user/socialhomepage");
  };

  const handleClick = (choice) => {
    navigate("/user/Social_add_post", { state: { uploadType: choice } });
  };

  const handleEdit = () => {
    navigate("/user/Updtae_prfile");
  };

  const handleDelete = async (id, image, video) => {
    console.log("Deleting post with id:", id, image, video);
    const deleteEndpoint = user.roles === "native"
      ? (image ? "/native/deleteImagePost" : "/native/deleteVideoPost")
      : (image ? "/user/deleteImagePost" : "/user/deleteVideoPost");

    try {
      const response = await axios.delete(deleteEndpoint, { data: { id } });
      console.log(response.data);
      if (response.data === "Data deleted") {
        setPosts(posts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error("Error deleting the post:", error);
    }
  };

  const handleEditPost = (id, caption, picture, type) => {
    const determinedType = picture.includes(".png") || picture.includes(".jpg") ? "image" : "video";
    navigate("/user/update_post", {
      state: {
        id,
        caption,
        picture,
        type: determinedType,
      },
    });
  };

  useEffect(() => {
    async function getInfo() {
      const rolePath = user.roles === "native" ? "/native/socialdata" : "/user/socialdata";
      try {
        const id = JSON.parse(localStorage.getItem("user")).id;
        const response = await axios.get(rolePath, { params: { id: id } });

        console.log("-----------------userprofile", response.data);

        if (response.data.Userphoto[0].Profile_pic) {
          setProfileImage(`http://127.0.0.1:5000/${response.data.Userphoto[0].Profile_pic}`);
        }
        if (response.data.Userphoto[0].Cover_photo) {
          setBannerImage(`http://127.0.0.1:5000/${response.data.Userphoto[0].Cover_photo}`);
        }

        setPosts(response.data.combinedMedia);
        setName(response.data.Userphoto[0].Name);
      } catch (error) {
        console.log(error);
      }
    }

    getInfo();
  }, [user.roles]);

  const toggleCommentBox = async (postId, postType) => {
    let isCommentsVisible = commentBoxVisible[postId];

    if (!isCommentsVisible) {
      try {
        const response = await axios.get("/user/fetch_all_comments", {
          params: { Post_ID: postId },
        });

        console.log("Comments fetched for post:", postId, response.data);

        const formattedComments = response.data.map((comment) => ({
          name: comment.CommenterName,
          comment: comment.Comment,
          createdAt: new Date(comment.createdAt).toDateString(),
        }));

        setComments((prev) => ({ ...prev, [postId]: formattedComments }));
      } catch (error) {
        console.error("Error fetching comments: ", error.message);
      }
    }

    setCommentBoxVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = async (e, postId, postType) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const payload = {
        UserID: user.id,
        PostID: postId,
        Comment: commentText,
      };

      await axios.post("/user/Add_Comment", payload);

      setCommentText("");

      // Fetch updated comments after submitting a new one
      const response = await axios.get("/user/fetch_all_comments", {
        params: { Post_ID: postId },
      });

      const formattedComments = response.data.map((comment) => ({
        name: comment.CommenterName,
        comment: comment.Comment,
        createdAt: new Date(comment.createdAt).toDateString(),
      }));

      setComments((prev) => ({ ...prev, [postId]: formattedComments }));
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  return (
    <div className="body3">
      <main className="my-5" style={{ borderRadius: 30 }}>
        <header>
          <div className="tb">
            <div className="td" id="logo">
              <a className="navbar-brand px-lg-5 px-sm-2 d-flex align-items-center" href="#">
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
                    <span className="td">
                      <i className="material-icons">
                        <ion-icon name="home-outline" onClick={navigateToHomepage}></ion-icon>
                      </i>
                    </span>
                  </div>
                </div>
                <div className="td"></div>
              </div>
            </div>
          </div>
        </header>
        <div id="profile-upper">
          <div id="profile-banner-image">
            <img src={bannerImage} alt="Banner image" />
          </div>
          <div id="profile-d">
            <div style={{ width: 200, height: 200, marginTop: 20 }}>
              <img src={profileImage} style={{ width: 200, height: 200, border: "3px solid white", borderRadius: 30 }} alt="User" />
            </div>
            <div id="u-name">{name}</div>
            <div className="tb" id="m-btns">
              <div className="td">
                <div onClick={handleEdit} className="m-btn bg-primary" style={{ marginTop: "3px" }}>
                  <i style={{ fontSize: 22 }}>
                    <ion-icon name="create-outline"></ion-icon>
                  </i>
                  <span>Edit Profile</span>
                </div>
              </div>
            </div>
          </div>
          <div id="black-grd"></div>
        </div>
        <div id="main-content">
          <div className="tb">
            <div className="td" id="l-col"></div>
            <div className="td" id="m-col">
              <div className="m-mrg" id="composer">
                <div id="c-tabs-cvr">
                  <div className="tb" id="c-tabs">
                    <div className="td active">
                      <i className="material-icons">
                        <ion-icon name="menu-outline"></ion-icon>
                      </i>
                      <span>Make Post</span>
                    </div>
                    <div className="td" onClick={() => handleClick("image")}>
                      <i className="material-icons">
                        <ion-icon name="camera-outline"></ion-icon>
                      </i>
                      <span>Photo</span>
                    </div>
                    <div className="td" onClick={() => handleClick("video")}>
                      <i className="material-icons">
                        <ion-icon name="videocam-outline"></ion-icon>
                      </i>
                      <span>Video</span>
                    </div>
                  </div>
                </div>
                <div id="c-c-main">
                  <div className="tb">
                    <div></div>
                  </div>
                </div>
              </div>
              <div>
                {posts.map((post) => {
                  const postId = post.VideoID || post.ImageID;
                  const postType = post.VideoID ? "video" : "image";

                  return (
                    <div key={post.id} className="post my-4">
                      <div className="tb">
                        <a href="#" className="td p-p-pic">
                          <img src={profileImage} alt="Profile pic" />
                        </a>
                        <div className="td p-r-hdr">
                          <div className="p-u-info">
                            <p>{post.img_caption || post.Captions}</p>
                          </div>
                          <div className="p-dt">
                            <i className="material-icons">
                              <ion-icon name="calendar-outline"></ion-icon>
                            </i>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <button className="btn btn-primary" style={{ fontSize: 15 }} onClick={() => handleEditPost(post.id, post.img_caption || post.Captions, post.picture || post.Video, post.img_caption ? "image" : "video")}>
                            Update Post
                          </button>
                          <button className="btn btn-danger mx-2" style={{ fontSize: 15 }} onClick={() => handleDelete(post.id, post.picture, post.Video)}>
                            Delete Post
                          </button>
                        </div>
                      </div>
                      <a href="#" className="p-cnt-v">
                        {post.picture && <img src={`http://127.0.0.1:5000/${post.picture}`} alt="Post" />}
                        {post.Video && <video controls src={`http://127.0.0.1:5000/${post.Video}`} />}
                      </a>
                      <div className="p-acts">
                        <div className="p-act comment" onClick={() => toggleCommentBox(postId, postType)}>
                          <i className="material-icons" style={{ fontSize: 22 }}>
                            <ion-icon name="chatbox"></ion-icon>
                          </i>
                        </div>
                      </div>

                      {commentBoxVisible[postId] && (
                        <div className="bg-gray-100 p-6" style={{ maxWidth: "100%" }}>
                          <h2 className="text-lg font-bold mb-4">Comments</h2>
                          <div className="flex flex-col space-y-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            {comments[postId]?.map((comment, index) => (
                              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold">{comment.name}</h3>
                                <p className="text-gray-700 text-sm mb-2">{comment.createdAt}</p>
                                <p className="text-gray-700">{comment.comment}</p>
                              </div>
                            ))}
                            <form className="bg-white p-4 rounded-lg shadow-md" onSubmit={(e) => handleCommentSubmit(e, postId, postType)}>
                              <div className="mb-4">
                                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comment" rows="3" placeholder="Enter your comment" value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
                              </div>
                              <button className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div id="loading">
                <i className="material-icons" style={{ fontSize: 30 }}>
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
