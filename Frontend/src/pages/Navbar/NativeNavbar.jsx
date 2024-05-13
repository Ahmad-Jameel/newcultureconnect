import React from 'react'
import logo from "../../assets/logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Navbar/Navbar2.css'
import pic12 from "../../assets/light11.jpg"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
import axios from '../../axios';

export default function Navbar2() {

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

    const textStyle = {
      position: 'absolute',
      top: '50%',
      left: '20px',
      transform: 'translateY(-50%)',
      color: 'white',
      zIndex: 1,
    };
  
    return (
      <div style={{
        padding: '0px',
        margin: '0px',
        textDecoration: 'none',
        listStyle: 'none',
        boxSizing: 'border-box',
      }}>
        <div style={{fontFamily: 'montserrat'}}>
          <nav id='my-nav1'>
          <input type="checkbox" id="check1"/>
            <label for="check" class="checkbtn" id='checkbtnn1'>
              <i class="fas fa-bars"></i>
            </label>
            <label id="my-logo1">CultureConnect</label>
  
            <ul id='ul-design1' >
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/user/Homepage')} >Blogs</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/user/socialhomepage')}>SocialMedia</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/user/Nativeservices')}>Services</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/user/Feedback')}>Feedback</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/allUsersProfile')}>Add Blogs</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={() => navigate('/user/chatbox')}>Chatbox</a></li>
              <li class='li-design1'><a class='my-nav-link1' href="#" onClick={handleLogout}>Logout</a></li>
              
            </ul>
          </nav>
          <section id='nav-sec-pic1'>
            <img src="" alt="" />
             <div style={textStyle} className='px-lg-5'>
                <h1 className='mb-3 mt-5' style={{fontSize: 24,paddingTop:'240px'}}> Connecting Cultures <br></br>
                  Bridging Borders <br></br>
                  Embrace Unity.</h1>
                <p className='py-lg-3' style={{fontSize: 18,}} >Lorem ipsum dolor sit amet, consectetur adipisicing <br /> elit. Nam optio dicta accusantium magnam <br /> sint repudiandae, consectetur quasi iste aliquam id?</p>
              </div>
          </section>
  
      </div>
      </div>
  )
}
