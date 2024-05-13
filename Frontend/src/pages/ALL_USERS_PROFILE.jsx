import React, { useEffect, useState } from "react";
import axios from "../axios";
import defaultProfilePic from "../assets/user.jpeg";
import profileicon from "../assets/male-user-24.png";
import chat from "../assets/chat-24.png";
import { useNavigate } from "react-router-dom";

export default function ALL_USERS_PROFILE() {
  const [users, setUsers] = useState([]);
  const [openedUserId, setOpenedUserId] = useState(null);
  const baseURL = "http://127.0.0.1:5000/";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUserId = JSON.parse(localStorage.getItem("user")).id;
        const response = await axios.get("/user/allusers_in_plateform", {
          params: { excludeId: currentUserId },
        });
        setUsers(response.data);
        console.log("userdata", response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = (userId) => {
    console.log(`Add friend for user ${userId}`);
  };

  const handleChatWithUser = async (UserID) => {
    const currentUserId = JSON.parse(localStorage.getItem("user")).id;

    try {
      await axios.get("/user/check_chat_box", {
        params: {
          sender_id: currentUserId,
          id: UserID,
        },
      });

      navigate("/user/chatbox", { state: { UserID: UserID } });
    } catch (error) {
      console.error("Error checking or creating chat:", error);
    }
  };

  const handleSeeProfile = (UserID) => {
    navigate("/OtherUserProfile", { state: { UserID: UserID } });
  };

  const toggleListVisibility = (UserID) => {
    setOpenedUserId(openedUserId === UserID ? null : UserID);
  };

  return (
    <>
     <h1
        className="mb-3 title mb-xl-4 text-uppercase text-center my-5"
        style={{ fontSize: "38px" }}
      >
        All Users
      </h1>

      <div className="container">
        <div className="row my-5">
        {users.map((user) => (
          <div className="col-md-4" key={user.id}>
            <div className="card mb-3" style={{ borderRadius: 20 }}>
              <div className="row g-0">
                <div className="col-lg-4 ">
                  <img
                    style={{height:"100%"}}
                    className=""
                    src={
                      user.Profile_pic
                        ? `${baseURL}${user.Profile_pic}`
                        : defaultProfilePic
                    }
                    alt="Profile"
                  />
                </div>
                <div className="col-lg-8">
                  <div className="card-body">
                    <div className="d-flex">
                    <h2 style={{ fontSize: 28 }} className="mb-1">
                      {user.Name}
                    </h2>
                    <p
                  className={` top-0 right-0  w-4 h-4 border-2 border-white rounded-full ${
                    user.is_Online ? "bg-green-500" : "bg-red-500"
                  }`}
                ></p>

                    </div>
                    
                    <br />
                    {/* <p className="text-secondary mb-0">{native.service}</p> */}

                    {/* <p style={{}}>{native.service.substring(0, 30)}</p> */}
                    <div className="d-flex">
                      <div className="my-3">
                        <a
                          href="#!"
                          className="btn bsb-btn-2xl btn-primary "
                          style={{ fontSize: 20 }}
                          onClick={() => handleChatWithUser(user.UserID)}
                        >
                          Chat
                        </a>
                      </div>
                      <div className="my-3 mx-3">
                        <a
                          href="#!"
                          className="btn bsb-btn-2xl btn-success "
                          style={{ fontSize: 20 }}
                          onClick={() => handleSeeProfile(user.UserID)}
                        >
                          Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}
