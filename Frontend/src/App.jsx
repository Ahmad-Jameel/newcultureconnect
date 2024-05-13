import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


import SignIn from "./pages/SignIn";
import ConfirmEmail from "./pages/ForgotPass/ConfirmEmail";
import Adds from "./pages/Adspage/showads"
import Chatbot from "./pages/chatbot/chatbot"
import Navbar from "./pages/Navbar/Navbar";
import Navbar2 from "./pages/Navbar/Navbar2"
import Chatbox from "./pages/Chatbox/Chatbox";
import Userprofile from "./pages/userprofile/userprofile"
import Socialhomepage from "./pages/userprofile/userfeed"
import Social_add_post from "./pages/userprofile/addpost"
import Updtae_prfile from "./pages/EditUserProfile/editprofile"
import UpdatePost from "./pages/userprofile/updatepost";
import Aboutus from "./pages/AboutUs/aboutus";
import Footerpage from "./pages/Footer/footer";
import Feedbackpage from "./pages/Feedback/feedback";
import UserPaymentpage from "./pages/Payment/payment";
import Homepage from "./pages/Home/home";
import Blogpage from "./pages/Home/articlepage";
import Addblog from "./pages/Home/addblog";
import NativeSignup from "./pages/NativeSignup/nativeSignup"
import NativeSignup2 from "./pages/NativeSignup/NativeSignup2";
import Servicepage from "./pages/Services/servicepage";
import NativeProfile from "./pages/Services/Nativeprofile";
import Nav3 from "./pages/Navbar/Navbar3";
import Adminfeedback from "./pages/Admin/Adminpanel";
import Protected from "./pages/protected"
import Adadds from "./pages/Adspage/adspage";
import AllUsersProfile from "./pages/ALL_USERS_PROFILE";
import SeeOtherUserProfile from "./pages/View_another_user_profile/userprofile";
import OneNativeallblog from "./pages/Home/my_blogs"
import MyOwnBlog from "./pages/Home/see_my_own_blogs"
import AdminNavBar from "./pages/Navbar/AdminNavBar"
import AdminViewSocialPost from "./pages/Admin/viewSocialpost"
import AdminViewBlogPost from "./pages/Admin/find_blog"
import AddNotification from "./pages/Admin/add_Notification"
import Notifications from './pages/userprofile/notification'
import AdminCheckPayment from "./pages/Payment/paymentpage"
import AdminSignIn from "./pages/Admin/adminSignIn"
import PaymentByCard from "./pages/Payment/payment_with _card"

import { UserContext } from "./Context/UserContext";


function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []); 

  return (
    <>

    
<UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn/>}></Route>
        <Route path="/user/signin" element={<SignIn/>}></Route>
        <Route path="/user/NativeSignup" element={<><NativeSignup/></>}></Route>
        <Route path="/native/NativeSignin" element={<><NativeSignup2/></>}></Route>
        <Route path="/Landing" element={<><Navbar/><Aboutus/><Footerpage/></>}></Route>
        <Route path="/confirmemail" element={<ConfirmEmail/>}></Route>
        <Route path="/user/forgetPassword" element={<ConfirmEmail/>} ></Route>

        {/* <Route path="/user/userprofile" element={<div> <Adds/> <Userprofile/> </div>}></Route>
        <Route path="/user/socialhomepage" element={<div><Adds/><Socialhomepage/></div>}></Route>
        <Route path="/user/Social_add_post" element={<div> <Adds/><Social_add_post/></div>}></Route>
        <Route path="/user/update_post" element={<div> <Adds/><UpdatePost/></div>}></Route>
        <Route path="/user/Updtae_prfile" element={<div> <Adds/><Updtae_prfile/></div>}></Route>
        
        <Route path="/user/Homepage" element={<div>
          <Chatbot/><Navbar2/><Homepage/><Footerpage/></div>}></Route>
          
        <Route path="/user/chatbox" element={<><Nav3/><Chatbox/></>}></Route>
        <Route path="/allUsersProfile" element={<><Nav3/><AllUsersProfile/><Footerpage/></>}></Route>
        <Route path="/OtherUserProfile" element={<SeeOtherUserProfile/>}></Route>

        <Route path="/notification" element={<Notifications/>}></Route> 
        <Route path="/ads" element={<Adds/>}></Route>   

         <Route path="/user/seeBlogs" element={<><Navbar2/><Blogpage/><Footerpage/></>}></Route>
         <Route path="/user/NativeProfile" element={<><Navbar2/><NativeProfile/><Footerpage/></>}></Route>
         <Route path="/user/Addblog" element={<><Navbar2/><Addblog/><Footerpage/></>}></Route>
         <Route path="/user/one_native_all_blog" element={<><Navbar2/><OneNativeallblog/><Footerpage/></>}></Route>
         <Route path="/user/native_my_own_blog" element={<><Navbar2/><MyOwnBlog/><Footerpage/></>}></Route>
         <Route path="/user/NativeServices" element={<><Navbar2/><Servicepage/><Footerpage/></>}></Route>

         <Route path="/user/Feedback" element={<><Feedbackpage/><Footerpage/></>}></Route>
         */}


<Route path="/user/userprofile" element={<Protected component={<div> <Adds/> <Userprofile/> </div>} allowableuser="user"/>}></Route>
<Route path="/user/socialhomepage" element={<Protected component={<div><Navbar2/><Socialhomepage/><Adds/></div>} allowableuser="user"/>}></Route>
<Route path="/user/Social_add_post" element={<Protected component={<div> <Adds/><Social_add_post/></div>} allowableuser="user"/>}></Route>
<Route path="/user/update_post" element={<Protected component={<div> <Adds/><UpdatePost/></div>} allowableuser="user"/>}></Route>
<Route path="/user/Updtae_prfile" element={<Protected component={<Updtae_prfile/>} allowableuser="user"/>}></Route>

<Route path="/user/Homepage" element={<Protected component={<div><Chatbot/><Navbar2/><Homepage/><Footerpage/></div>} allowableuser="user"/>}></Route>

<Route path="/user/chatbox" element={<Protected component={<><Navbar2/><Chatbox/></>} allowableuser="user"/>}></Route>
<Route path="/allUsersProfile" element={<Protected component={<><Navbar2/><AllUsersProfile/><Footerpage/></>} allowableuser="user"/>}></Route>
<Route path="/OtherUserProfile" element={<Protected component={<SeeOtherUserProfile/>} allowableuser="user"/>}></Route>

<Route path="/notification" element={<Protected component={<Notifications/>} allowableuser="user"/>}></Route> 
<Route path="/ads" element={<Protected component={<Adds/>} allowableuser="user"/>}></Route>   

<Route path="/user/seeBlogs" element={<Protected component={<><Navbar2/><Blogpage/><Footerpage/></>} allowableuser="user"/>}></Route>
<Route path="/user/NativeProfile" element={<Protected component={<><Navbar2/><NativeProfile/><Footerpage/></>} allowableuser="user"/>}></Route>
<Route path="/user/Addblog" element={<Protected component={<><Navbar2/><Addblog/><Footerpage/></>} allowableuser="user"/>}></Route>
<Route path="/user/one_native_all_blog" element={<Protected component={<><Navbar2/><OneNativeallblog/><Footerpage/></>} allowableuser="user"/>}></Route>
<Route path="/user/native_my_own_blog" element={<Protected component={<><Navbar2/><MyOwnBlog/><Footerpage/></>} allowableuser="user"/>}></Route>
<Route path="/user/NativeServices" element={<Protected component={<><Navbar2/><Servicepage/><Footerpage/></>} allowableuser="user"/>}></Route>

<Route path="/user/Feedback" element={<Protected component={<><Navbar2/><Feedbackpage/><Footerpage/></>} allowableuser="user"/>}></Route>




        <Route path="/adminfeedback" element={<><AdminNavBar/><Adminfeedback/></>}></Route>
        <Route path="/adminViewSocialPost" element={<><AdminNavBar/><AdminViewSocialPost/></>}></Route>
        <Route path="/adminViewBlogPost" element={<><AdminNavBar/><AdminViewBlogPost/></>}></Route>
        <Route path="/addads" element={<><AdminNavBar/><Adadds/></>}></Route>
        <Route path="/addNotification" element={<><AdminNavBar/><AddNotification/></>}></Route> 
        <Route path="/admin_check_payment" element={<><AdminNavBar/><AdminCheckPayment/></>}></Route>
        <Route path="/Admin/adminSignin" element={<AdminSignIn/>}></Route>
        <Route path="/user/Payment" element={<><UserPaymentpage/><Footerpage/></>}></Route>
        <Route path="/user/Paymen_with_card" element={<><PaymentByCard/><Footerpage/></>}></Route>
        

      </Routes>
      </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}

export default App