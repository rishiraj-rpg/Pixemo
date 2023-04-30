import React, { useEffect } from "react";
import "./Login.css";
import loginImg from "../../Images/login.svg";
import { useNavigate } from "react-router-dom";
import { globalContext } from "./../../globalState";
import { useContext } from "react";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    document.title = "Login";
  }, []);

  const { setLoggedin, setCurrentUser } = useContext(globalContext);
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:5000/api/v1/auth/login", user, {
        withCredentials: true,
      })
      .then((resp) => {
        window.localStorage.setItem("user", JSON.stringify(resp.data.user));
        window.localStorage.setItem("access_token", resp.data.token);
        setCurrentUser(resp.data.user);
        setLoggedin(true);
        history("/home");
      })
      .catch((err) => {
        console.log(err.msg);
        alert("Invalid Credentials");
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="login_flex-container">
      <div className="login_container">
        <h1 className="container_title">Login</h1>
        <form className="input_main_container" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="email" className="input_container-label">
              Email
            </label>
            <input
              type="text"
              name="email"
              className="input_container-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input_container" style={{marginBottom: 0}}>
            <label htmlFor="password" className="input_container-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input_container-input"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
      <img src={loginImg} alt="login image" className="login_svg"/>
    </div>
  );
};

export default Login;
