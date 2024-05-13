import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../axios";
import pic2 from "../../assets/profileIcon.png";
import PaymentViaCard from "../Payment/payment_with _card";

export default function Nativeprofile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const currentUserId = JSON.parse(localStorage.getItem("user")).id;
  console.log("--------------------current", currentUserId);

  const [userData, setUserData] = useState({
    Name: "",
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Profile_pic: "",
    city: "",
    province: "",
    language: "",
    service: "",
    qualification: "",
    Feild_qualification: "",
  });

  const [showPaymentCard, setShowPaymentCard] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Making request for userId:", userId);
        const response = await axios.get(
          `http://localhost:5000/native/see_native_profile`,
          { params: { id: userId } }
        );
        console.log("Response received:", response.data);
        setUserData(response.data.Userphoto || response.data);
      } catch (error) {
        console.error("Error fetching user data: ", error.message);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  const handleNavigation = (userId) => {
    navigate("/user/one_native_all_blog", { state: { userId: userId } });
    console.log("sending user id to my blog page---------", userId);
  };

  const togglePaymentCard = () => {
    setShowPaymentCard(!showPaymentCard);
  };

  const userState = { senderId: currentUserId, receiverId: userData?.UserID };

  return (
    <>
      <body class="font-poppins">
        <div id="container" class="px-20  flex px-24 justify-center">
          <div class="p-20  flex flex-col md:flex-row px-24 ">
            <div class="mr-10">
              <img
                className="rounded-lg "
                src={
                  userData.Profile_pic
                    ? `http://localhost:5000/${userData.Profile_pic.replace(
                        /\\/g,
                        "/"
                      )}`
                    : pic2
                }
                alt="Profile"
                // style={{ maxWidth: "100%", height: 300 }} // Add this style
              />
            </div>
            <div class="w-full sm:w-[70%] md:w-[60%] lg:w-[50%]">
              {showPaymentCard && (
                <div className="absolute w-fit flex flex-col justify-center items-center rounded-lg shadow-lg bg-white z-20 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-10 min-w-[350px]">
                  {showPaymentCard && <PaymentViaCard data={userState} />}{" "}
                  {showPaymentCard && (
                    <button
                      className="bg-red-600 hover:bg-red-700 text-dark font-medium py-2 px-6 rounded-lg focus:outline-none"
                      onClick={() => {
                        setShowPaymentCard(!showPaymentCard);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
              <h1 class="text-success font-bold text-5xl mt-6 mb-8">
                Hey, I'm {userData.FirstName} {userData.LastName}
              </h1>
              <h2 class=" text-2xl mt-6 mb-2">
                <b>Province:</b> <i>{userData.province}</i>
              </h2>
              <h3 class="text-dark  text-2xl mt- mb-2">
                <b>City:</b> <i>{userData.city}</i>
              </h3>
              <h3 class="text-dark  text-2xl mt- mb-2">
                <b>Language: </b> <i>{userData.language}</i>
              </h3>
              <h3 class="text-dark  text-2xl">
                <b> Qualification:</b> <i> {userData.Feild_qualification}</i>
              </h3>
              <p class="text-dark text-2xl my-2 mb-3">{userData.service}</p>
              <div id="social" className="flex mt-2 gap-4">
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    togglePaymentCard();
                    sendDataToPayment();
                  }}
                  className="btn btn-primary py-2"
                  style={{ width: "calc(50% - 2rem)" }}
                >
                  Learn with me
                </button>
                <button
                  onClick={() => handleNavigation(userData?.UserID)}
                  className="btn btn-dark"
                  style={{ width: "calc(50% - 2rem)" }}
                >
                    See my blogs
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
