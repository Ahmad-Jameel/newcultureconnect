import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { all } from 'axios';

function Protected({ component: Component,allowableuser }) {
  console.log('I am in protected.js');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user');

    if (!token) {
      navigate('/Landing');
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Token is:",decodedToken)
      const userRole = decodedToken.role;
      console.log('user:', userRole);
      console.log("allowable",allowableuser)
      if(userRole!=allowableuser){
        if(userRole==="user"){navigate("/user/Homepage")}
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/Landing');
    }
  }, [navigate]);

  return Component ;
}

export default Protected;
