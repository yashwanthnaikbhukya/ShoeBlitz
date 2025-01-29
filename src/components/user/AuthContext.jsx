import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState()

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    axios.post('http://localhost:5000/api/v1/users/check-login',{},{
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);
          setUsername(response.data.data.user.username)
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {

        setIsLoggedIn(false);
      });
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
