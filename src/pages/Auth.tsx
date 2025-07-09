
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new custom sign-in page
    navigate('/signin', { replace: true });
  }, [navigate]);

  return null;
};

export default Auth;
