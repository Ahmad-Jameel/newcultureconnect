import React, { useState, useEffect } from "react";
import "../userprofile/userprofile.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";

import logo from "../../assets/logo.png";
import pic1 from "../../assets/profileIcon.png";
import pic2 from "../../assets/profileIcon.png";

export default function userprofile() {
  const { user } = useContext(UserContext);
  console.log("Users Role", user.roles);

  const [bannerImage, setBannerImage] = useState(pic1);
  const [profileImage, setProfileImage] = useState(pic2);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/user/socialhomepage");
  };

  const navigateToUserProfile = () => {
    navigate("/user/userprofile");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClick = (choice) => {
    navigate("/user/Social_add_post", { state: { uploadType: choice } });
  };

  const handleEdit = () => {
    navigate("/user/Updtae_prfile");
  };
  //-----------------
  const handleDelete = async (id, image, video) => {
    console.log("Deleting post with id:", id, image, video);
    if (image) {
      if (user.roles == "native") {
        try {
          const response = await axios.delete("/native/deleteImagePost", {
            data: { id },
          });
          console.log(response.data);
          if (response.data === "Data deleted") {
            setPosts(posts.filter((post) => post.id !== id));
          }
        } catch (error) {
          console.error("Error deleting the image post:", error);
        }
      } else {
        try {
          const response = await axios.delete("/user/deleteImagePost", {
            data: { id },
          });
          console.log(response.data);
          if (response.data === "Data deleted") {
            setPosts(posts.filter((post) => post.id !== id));
          }
        } catch (error) {
          console.error("Error deleting the image post:", error);
        }
      }
    } else if (video) {
      if (user.roles == "native") {
        try {
          const response = await axios.delete("/native/deleteVideoPost", {
            data: { id },
          });
          console.log(response.data);
          if (response.data === "Data deleted") {
            setPosts(posts.filter((post) => post.id !== id));
          }
        } catch (error) {
          console.error("Error deleting the image post:", error);
        }
      } else {
        try {
          const response = await axios.delete("/user/deleteVideoPost", {
            data: { id },
          });
          console.log(response.data);
          if (response.data === "Data deleted") {
            setPosts(posts.filter((post) => post.id !== id));
          }
        } catch (error) {
          console.error("Error deleting the image post:", error);
        }
      }
    }
  };

  //--------------------

  const handleEditPost = (id, caption, picture, type) => {
    const determinedType =
      picture.includes(".png") || picture.includes(".jpg") ? "image" : "video";
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
      if (user.roles == "native") {
        try {
          const id = JSON.parse(localStorage.getItem("user")).id;
          const response = await axios.get("/native/socialdata", {
            params: { id: id },
          });

          console.log("-----------------userprofile", response.data);

          if (response.data.Userphoto[0].Profile_pic) {
            setProfileImage(
              `http://127.0.0.1:5000/${response.data.Userphoto[0].Profile_pic}`
            );
          }
          if (response.data.Userphoto[0].Cover_photo) {
            setBannerImage(
              `http://127.0.0.1:5000/${response.data.Userphoto[0].Cover_photo}`
            );
          }

          setPosts(response.data.combinedMedia);
          setName(response.data.Userphoto[0].Name);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const id = JSON.parse(localStorage.getItem("user")).id;
          const response = await axios.get("/user/socialdata", {
            params: { id: id },
          });

          console.log("-----------------userprofile", response.data);

          if (response.data.Userphoto[0].Profile_pic) {
            setProfileImage(
              `http://127.0.0.1:5000/${response.data.Userphoto[0].Profile_pic}`
            );
          }
          if (response.data.Userphoto[0].Cover_photo) {
            setBannerImage(
              `http://127.0.0.1:5000/${response.data.Userphoto[0].Cover_photo}`
            );
          }

          setPosts(response.data.combinedMedia);
          setName(response.data.Userphoto[0].Name);
        } catch (error) {
          console.log(error);
        }
      }
    }

    getInfo();
  }, []);

  return (
    <div classNameName="body3">
      <main className="my-5" style={{borderRadius:30}}>
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
                    <span className="td">
                      <i className="material-icons">
                        <ion-icon
                          name="home-outline"
                          onClick={navigateToHomepage}
                        ></ion-icon>
                      </i>
                    </span>
                  </div>
                </div>
                <div className="td">
                  {/* <a href="#" id="p-link" onClick={navigateToUserProfile}>
                    <img src={profileImage} />
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </header>
        <div id="profile-upper">
          <div id="profile-banner-image">
            <img src={bannerImage} alt="Banner image" />
          </div>
          <div id="profile-d">
            <div style={{width:200, height:200 , marginTop:20, }} >
              <img src={profileImage} style={{width:200, height:200,border:"3px solid white", borderRadius:30}} alt="User" />
            </div>
            <div id="u-name">{name}</div>
            <div className="tb" id="m-btns">
              <div className="td">
                <div
                  onClick={handleEdit}
                  className="m-btn bg-primary"
                  style={{ marginTop: "3px" }}
                >
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
              {/* <div className="m-mrg" id="p-tabs">
                <div className="tb">
                  <div className="td">
                    <div className="tb" id="p-tabs-m">
                      <div className="td active">
                        <i className="material-icons">
                          <ion-icon name="albums-outline"></ion-icon>
                        </i>
                        <span>TIMELINE</span>
                      </div>
                      <div className="td">
                        <i className="material-icons">
                          <ion-icon name="people-outline"></ion-icon>
                        </i>
                        <span>FRIENDS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
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
                    {/* //--------------------------------------------------------------------------------- */}
                    <div></div>
                  </div>
                </div>
              </div>
              <div>
                {posts.map((post, index) => (
                  <div key={post.id} className="post my-4">
                    <div className="tb">
                      <a href="#" className="td p-p-pic">
                        <img src={profileImage} alt="Profile pic" />{" "}
                      </a>
                      <div className="td p-r-hdr">
                        <div className="p-u-info">
                          <p>{post.img_caption || post.Captions}</p>{" "}
                        </div>
                        <div className="p-dt">
                          <i className="material-icons">
                            <ion-icon name="calendar-outline"></ion-icon>
                          </i>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>{" "}
                        </div>
                      </div>
                      <div>

                        <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-primary" style={{fontSize:15}}
                          onClick={() =>
                            handleEditPost(
                              post.id,
                              post.img_caption || post.Captions,
                              post.picture || post.Video,
                              post.img_caption ? "image" : "video"
                            )
                          }
                        >
                          Update Post
                        </button>
                        <button
                          className="btn btn-danger mx-2" style={{fontSize:15}}
                          onClick={() =>
                            handleDelete(post.id, post.picture, post.Video)
                          }
                        >
                          Delete Post
                        </button>

                        </div>
                        {/* <button
                          className="btn btn-primary dropdown-toggle my-2"
                          style={{
                            backgroundColor: "blue",
                            color: "white",
                            border: "1px solid blue",
                            padding: "1px 2px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            outline: "none",
                          }}
                          type="button"
                          onClick={toggleDropdown}
                        >
                          <ion-icon
                            style={{ fontSize: "15px" }}
                            name="ellipsis-vertical"
                          ></ion-icon>
                        </button> */}
                        {/* {dropdownOpen && (
                          <ul
                            style={{
                              listStyle: "none",
                              backgroundColor: "#f9f9f9",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              marginTop: "2px",
                              padding: "4px 0",
                              maxWidth: "120px",
                            }}
                          >
                            <li
                              style={{
                                display: "block",
                                color: "#333",
                                textDecoration: "none",
                                padding: "8px 16px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleEditPost(
                                    post.id,
                                    post.img_caption || post.Captions,
                                    post.picture || post.Video,
                                    post.img_caption ? "image" : "video"
                                  )
                                }
                              >
                                <h5 style={{ fontSize: "10px" }}>
                                  Update Post
                                </h5>
                              </button>
                            </li>
                            <li
                              style={{
                                display: "block",
                                color: "#333",
                                textDecoration: "none",
                                padding: "8px 16px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleDelete(
                                    post.id,
                                    post.picture,
                                    post.Video
                                  )
                                }
                              >
                                <h5 style={{ fontSize: "10px" }}>
                                  Delete Post
                                </h5>
                              </button>
                            </li>
                          </ul>
                        )} */}
                      </div>
                    </div>
                    <a href="#" className="p-cnt-v">
                      {post.picture && (
                        <img
                          src={`http://127.0.0.1:5000/${post.picture}`}
                          alt="Post"
                        />
                      )}{" "}
                      {post.Video && (
                        <video
                          controls
                          src={`http://127.0.0.1:5000/${post.Video}`}
                        />
                      )}{" "}
                    </a>
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
