import React, { useState } from "react";
import "./Register.scss";

import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [firstName, setfirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const register = (e) => {
    e.preventDefault();
    const userNameError = document.getElementById(".username.error");
    const firstNameError = document.querySelector(".firstName.error");
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");
    console.log(username);
    Axios.post("http://localhost:5000/user/register", {
      username: username,
      firstName: firstName,
      email:email,
      password: password,
      
    }).then((res) => {
      console.log("res", res);
      if (res.data.errors) {
        userNameError.innerHTML = res.data.errors.userName;
        firstNameError.innerHTML = res.data.errors.firstName
        emailError.innerHTML = res.data.errors.email;
        passwordError.innerHTML = res.data.errors.password;
        
      } else {
        navigate("/", { replace: true });
  }});
    
  };


  return (
    <div className="Register">
      <h1>Registration</h1>
      <div className="RegisterForm">
        <input
          type="text"
          placeholder="Username..."
          onChange={(event) => 
            setUsername(event.target.value)}
            value={username}
          
        />
        <div className="Username error"></div>
        <input
          type="text"
          placeholder="firstName..."
          onChange={(event) => 
            setfirstName(event.target.value)}
            value={firstName}
          
        />
        <div className="firstName error"></div>
        <input
          type="text"
          placeholder="email..."
          onChange={(event) => 
            setEmail(event.target.value)}
            value={email}
          
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(event) => 
            setPassword(event.target.value)}
            value={password}
          
        />
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}

export default Register;
