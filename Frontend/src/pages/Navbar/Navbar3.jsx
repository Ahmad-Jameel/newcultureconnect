// Navbar3.js
import React, { useState } from 'react';
import '../Navbar/Navbar3.css'; // Adjust the path to your CSS file
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
import axios from '../../axios';

export default function Navbar3() {
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    axios.put('/user/logout', null, {
      params: { id: userId }
    })

    localStorage.removeItem("user");
    Swal.fire({
      title: "Done!",
      text: "Logged Out Successfully.",
      icon: "success"
    });
    console.log("Token has been Removed");
    navigate('/user/signin');

  };


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div style={{ fontFamily: 'montserrat' }}>
      <nav id="my-nav3">
        <input type="checkbox" id="check3" checked={isChecked} onChange={handleCheckboxChange} />
        <label htmlFor="check3" className="checkbtn" id="checkbtnn3">
          <i className="fas fa-bars"></i>
        </label>
        <label id="my-logo3">CultureConnect</label>

        <ul id="ul-design3" className={isChecked ? 'active' : ''}>
          <li className="li-design3">
            <a className="my-nav-link3 btn text-light" href="#" style={{fontSize:22}} onClick={() => navigate('/user/Homepage')}>
              Blogs
            </a>
          </li>
          <li className="li-design3">
            <a className="my-nav-link3 btn text-light" href="#" style={{fontSize:22}} onClick={() => navigate('/user/socialhomepage')}>
              SocialMedia
            </a>
          </li>
          <li className="li-design3">
            <a className="my-nav-link3 btn text-light" href="#" style={{fontSize:22}} onClick={() => navigate('/user/Nativeservices')}>
              Services
            </a>
          </li>
          <li className="li-design3">
            <a className="my-nav-link3 btn text-light" href="#" style={{fontSize:22}} onClick={() => navigate('/user/Feedback')}>
              Feedback
            </a>
          </li>
          <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/allUsersProfile')}>AllUsers</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/user/chatbox')}>Chatbox</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={handleLogout}>Logout</a></li>
        </ul>
      </nav>
    </div>
  );
}
