import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function AdminProtected({ component: Component, allowableUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin');

    if (!token) {
      navigate('/Landing');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Token is:", decodedToken);
      const userRole = decodedToken.role;
      console.log('user:', userRole);
      console.log("allowable", allowableUser);

      if (userRole !== allowableUser) {
        if (userRole === "admin") {
          navigate("/adminfeedback");
        } else {
          navigate('/Landing');  // Navigate to a default route if the role is not allowed
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/Admin/adminSignin');
    }
  }, [navigate, allowableUser]);

  return <>{Component}</>;
}

export default AdminProtected;
