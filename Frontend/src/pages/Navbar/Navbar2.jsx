import "bootstrap/dist/css/bootstrap.min.css";
import "../Navbar/Navbar2.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../axios";
import logo from "../../assets/logo.png";

import { UserContext } from "../../Context/UserContext";
import React, { useEffect, useContext, useState } from "react";
import Notification from "../userprofile/notification";

export default function Navbar2() {
  const { user } = useContext(UserContext);
  console.log("Users Role", user.roles);
  console.log("-----------------user ID for notification", user.id);
  const [hasNotification, setHasNotification] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    checkNotificationState();
  }, [user.id]);

  const checkNotificationState = async () => {
    if (user && user.id) {
      try {
        const response = await axios.get("/user/check_notification_state", {
          params: { id: user.id },
        });

        console.log(
          "status of notification coming from backend",
          response.data
        );
        setHasNotification(response.data);
      } catch (error) {
        console.error("Error checking notification state:", error);
      }
    }
  };

  const handleNotificationCLick = () => {
    setNotificationOpen(!notificationOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    axios.put("/user/logout", null, {
      params: { id: userId },
    });

    localStorage.removeItem("user");
    Swal.fire({
      title: "Done!",
      text: "Logged Out Successfully.",
      icon: "success",
    });
    console.log("Token has been Removed");
    navigate("/user/signin");
  };

  const textStyle = {
    position: "absolute",
    top: "50%",
    left: "20px",
    transform: "translateY(-50%)",
    color: "white",
    zIndex: 1,
  };

  return (
    <div
      style={{
        padding: "0px",
        margin: "0px",
        textDecoration: "none",
        listStyle: "none",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontFamily: "montserrat" }}>
        <nav id="my-nav1">
          <input type="checkbox" id="check1" />
          <label for="check" class="checkbtn" id="checkbtnn1">
            <i class="fas fa-bars"></i>
          </label>
          <label id="my-logo1">CultureConnect</label>

          <ul id="ul-design1">

          <li className="li-design1">
  <a className="my-nav-link1" onClick={handleNotificationCLick}>
  {notificationOpen && <Notification userId={user.id} />}
    <i className={`fas fa-bell ${hasNotification ? "ring-animation" : ""}`}></i>
  </a>
</li>

            <li class="li-design1">
              <a
                class="my-nav-link1"
                href="#"
                onClick={() => navigate("/user/Homepage")}
              >
                Blogs
              </a>
            </li>
            <li class="li-design1">
              <a
                class="my-nav-link1"
                href="#"
                onClick={() => navigate("/user/socialhomepage")}
              >
                SocialMedia
              </a>
            </li>
            {user.roles === "native" && (
              <li className="li-design1">
                <a
                  className="my-nav-link1"
                  href="#"
                  onClick={() => navigate("/user/native_my_own_blog")}
                >
                  Myblogs
                </a>
              </li>
            )}
            <li class="li-design1">
              <a
                class="my-nav-link1"
                href="#"
                onClick={() => navigate("/user/Nativeservices")}
              >
                Services
              </a>
            </li>
            {/* <li class="li-design1">
              <a
                class="my-nav-link1"
                href="#"
                onClick={() => navigate("/user/Feedback")}
              >
                Feedback
              </a>
            </li> */}
            {user.roles === "native" ? (
              <li className="li-design1">
                <a
                  className="my-nav-link1"
                  href="#"
                  onClick={() => navigate("/user/Addblog")}
                >
                  Addblog
                </a>
              </li>
            ) : (
              <li className="li-design1">
                <a
                  className="my-nav-link1"
                  href="#"
                  onClick={() => navigate("/allUsersProfile")}
                >
                  AllUsers
                </a>
              </li>
            )}
            <li class="li-design1">
              <a
                class="my-nav-link1"
                href="#"
                onClick={() => navigate("/user/chatbox")}
              >
                Chatbox
              </a>
            </li>
            <li class="li-design1">
              <a class="my-nav-link1" href="#" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
