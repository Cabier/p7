import React, { useState } from "react";
import "./Navbar.scss";
import  {useEffect} from "react";
import Logout from "../pages/Logout/Logout";
function Navbar() {
  const [loggedIn, setLoggedIn] = useState(true);
  
  useEffect(() => {
    
    setLoggedIn(localStorage.getItem("loggedIn"));
    console.log(loggedIn);
  }, [localStorage.getItem("loggedIn")]);

  return (
    <div className="Navbar">
      <img className="logo" src="../imgs/logo/icon-left-font-recadre.png" alt="Groupomania" />
      <a href="/">Home</a>
      {loggedIn ? (
        <>
          
          <a href="/upload">Upload</a>
          <a href="/profile">Profile</a>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
          <Logout />
        </>
      ) : (
        <>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
        </>
      )}
    </div>
  );
}

export default Navbar;
