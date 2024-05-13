import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import pic2 from "../../assets/foreground.jpg";

export default function Hero() {
  
  const navigate = useNavigate();

  const textStyle = {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    color: 'white',
    zIndex: 1,
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    zIndex: 1,
  };

  const imageStyle = {
    position: 'relative',
    height: '610px',
    width: '100%',
    objectFit: 'cover',
  };

  return (
    <div style={{backgroundColor: '#FEFBEA'}} className="container-fluid">
      <div id="demo" className="carousel slide" data-bs-ride="carousel">
        {/* ... (carousel code remains the same) */}
        <div className="carousel-inner" style={{ borderRadius: 0 }}>
          <div className="carousel-item active">
            <div style={textStyle} className='px-lg-5'>
              <h1> Connecting Cultures <br></br>
                Bridging Borders <br></br>
                Embrace Unity.</h1>
              <p className='py-lg-3'>Lorem ipsum dolor sit amet, consectetur adipisicing <br /> elit. Nam optio dicta accusantium magnam <br /> sint repudiandae, consectetur quasi iste aliquam id?</p>
              <button
                style={{fontSize: 20, margin: 5}}
                className="btn btn-primary"
                onClick={() => navigate('/user/signin')} 
              >
                Get Started
              </button>

              <button
                style={{fontSize: 20, margin: 5}}
                className="btn btn-secondary mx-3"
                onClick={() => navigate('/native/NativeSignup')}
              >
                Work With Us
              </button>
            </div>
            <img src={pic2} style={imageStyle} alt="Los Angeles" />
          </div>
          
        </div>
      </div>
    </div>
  );
}
