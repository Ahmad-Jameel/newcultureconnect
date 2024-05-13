import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Navbar/Navbar.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuStyle = {
    display: isMenuOpen ? 'block' : 'none',
  };

  const textStyle = {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    color: 'white',
    zIndex: 1,
  };

  const handleGetStartedClick = () => {
    navigate("/user/signin");
  };

  const handleWorkWithUsClick = () => {
    navigate("/user/NativeSignup");
  };

  const handleNativeSignInClick = () => {
    navigate("/native/NativeSignin");
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
        <nav id='my-nav'>
          <input type="checkbox" id="check"/>
          <label htmlFor="check" className="checkbtn" id='checkbtnn'>
            <i className="fas fa-bars"></i>
          </label>
          <label id="my-logo">CultureConnect</label>

          <ul id='ul-design'>
          <li id='li-design'>
  <button 
    id='my-nav-link' 
    className="active" 
    style={{background: 'none', border: 'none', padding: 0,  cursor: 'pointer'}}
    onClick={handleNativeSignInClick}
  >
    Native?
  </button>
</li>
            <li id='li-design'><a id='my-nav-link' href="#">Our Team</a></li>
            <li id='li-design'><a id='my-nav-link' href="#">Services</a></li>
          </ul>
        </nav>
        <section id='nav-sec-pic'>
          <div style={textStyle} className='px-lg-5'>
            <h1 className='mb-3 mt-5' style={{fontSize: 24, paddingTop:'240px'}}> Connecting Cultures <br />
              Bridging Borders <br />
              Embrace Unity.</h1>
            <p className='py-lg-3' style={{fontSize: 18}} >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam optio dicta accusantium magnam sint repudiandae, consectetur quasi iste aliquam id?</p>
            <button style={{fontSize: 20, margin: 5}} className="btn btn-primary" onClick={handleGetStartedClick}>Get Started</button>
            <button style={{fontSize: 20, margin: 5}} className="btn btn-secondary mx-3" onClick={handleWorkWithUsClick}>Work With Us</button>
          </div>
        </section>
      </div>
    </div>
  );
}
