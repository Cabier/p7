import React, { useState } from "react";
import "./Login.scss";
import Axios from "axios";
//local storage ajouter le token 
import { useNavigate } from "react-router-dom";
//utiliser le systeme de token au lieu du systeme de cookies par rapport a p6 
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  const login = () => {
    Axios.post("http://localhost:5000/user/login", {
      username: username,
      password: password,
      
    }).then((response) => {
      if (response.data.loggedIn) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("username", response.data.username);
        
        navigate("/", { replace: true });
      } else {
        setErrorMessage(response.data.message);
        localStorage.setItem("token",response.data)
      }
    });
  };

  return (
    <div className="Login">
      <h1>Login</h1>
      <div className="LoginForm">
        <input
          type="text"
          placeholder="Username..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={login}>Login</button>
        <h1 style={{ color: "red" }}>{errorMessage} </h1>
      </div>
    </div>
  );
}

export default Login;
