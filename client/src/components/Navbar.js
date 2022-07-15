import React, { useState } from "react";
import "./Navbar.css";
import  {useEffect} from "react";
function Navbar() {
  const [loggedIn, setLoggedIn] = useState(true);
  
  useEffect(() => {
    console.log(localStorage.getItem("loggedIn"));
    setLoggedIn(localStorage.getItem("loggedIn"));
    console.log(loggedIn);
  }, [localStorage.getItem("loggedIn")]);

  return (
    <div className="Navbar">
      <a href="/">Home</a>
      {loggedIn ? (
        <>
          <a href="/upload">Upload</a>
          <a href="/profile">Profile</a>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
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
