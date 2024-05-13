import React, { useState, useEffect } from "react";
import "../View_another_user_profile/userprofile.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";


import logo from "../../assets/logo.png";
import pic1 from "../../assets/profileIcon.png";
import pic2 from "../../assets/profileIcon.png";

export default function userprofile() {
  const {user} = useContext(UserContext);
  console.log('Users Role', user.roles);

  const [bannerImage, setBannerImage] = useState(pic1);
  const [profileImage, setProfileImage] = useState(pic2);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = 'http://127.0.0.1:5000/';
  
  const navigateToHomepage = () => {
    navigate("/user/Homepage");
  };


  useEffect(() => {
    const getInfo = async () => {

      if(user.roles == "native"){
      try {
        const userId = location.state?.UserID;
        console.log("other user prfile ID-----------" , userId)
        const response = await axios.get('/native/see_other_user_profile', {
          params: { id: userId },
        });
    
        console.log("--------------ok", response.data);
    
        if (response.data.Userphoto) {
          if (response.data.Userphoto.Profile_pic) {
            setProfileImage(
              `${baseURL}${response.data.Userphoto.Profile_pic}`
            );
          }
          if (response.data.Userphoto.Cover_photo) {
            setBannerImage(
              `${baseURL}${response.data.Userphoto.Cover_photo}`
            );
          }
          setName(response.data.Userphoto.Name);
        } else {
          console.error('Userphoto is not available or not structured as expected.');
        }
    
        setPosts(response.data.combinedMedia);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    else{

      try {
        const userId = location.state?.UserID;
        console.log("other user prfile ID-----------" , userId)
        const response = await axios.get('/user/see_other_user_profile', {
          params: { id: userId },
        });
    
        console.log("--------------ok", response.data);
    
        if (response.data.Userphoto) {
          if (response.data.Userphoto.Profile_pic) {
            setProfileImage(
              `${baseURL}${response.data.Userphoto.Profile_pic}`
            );
          }
          if (response.data.Userphoto.Cover_photo) {
            setBannerImage(
              `${baseURL}${response.data.Userphoto.Cover_photo}`
            );
          }
          setName(response.data.Userphoto.Name);
        } else {
          console.error('Userphoto is not available or not structured as expected.');
        }
    
        setPosts(response.data.combinedMedia);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }

    }
    };
    

    getInfo();
  }, []);
  
  
  return (
    <div classNameName="body3">
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
                    <span className="td">
                      <i className="material-icons">
                        <ion-icon name="home-outline" onClick={navigateToHomepage}></ion-icon>
                      </i>
                    </span>
                  </div>
                </div>
                <div className="td">
                  <a href="#" id="p-link" >
                    <img src={profileImage} />
                  </a>
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
            <div id="profile-pic">
              <img src={profileImage} className="cover3" alt="User" />
            </div>
            <div id="u-name">{name}</div>
            
          </div>
          <div id="black-grd"></div>
        </div>
        <div id="main-content">
          <div className="tb">
            <div className="td" id="l-col"></div>
            <div className="td" id="m-col">
             
              
              
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
