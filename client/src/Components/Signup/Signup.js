import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import signupImg from "../../Images/signup.svg";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    document.title = "Signup";
  }, []);

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password === user.confirmPassword) {
      axios
        .post("http://localhost:5000/api/v1/auth/register", user)
        .then((resp) => {
          console.log(resp.data);
          history("/login");
          alert("Registered Successfully!!")
        })
        .catch((error) => {
          console.log(error);
        });
    }else{
      alert("Password does not match!!")
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  }; 

  return (
    <div className="signup_flex-container">
      <img src={signupImg} alt="signup image" className="signup_svg" />
      <div className="signup_container">
        <h1 className="container_title">Signup</h1>
        <form className="input_main_container" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="name" className="input_container-label">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="input_container-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input_container">
            <label htmlFor="username" className="input_container-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="input_container-input"
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="password-flex">
            <div
              className="input_container password_input_container"
              style={{ marginLeft: 0 }}
            >
              <label htmlFor="password" className="input_container-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="input_container-input password_input"
                onChange={handleChange}
                required
              />
            </div>
            <div
              className="input_container password_input_container"
              style={{ marginRight: 0 }}
            >
              <label
                htmlFor="confirmPassword"
                className="input_container-label"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="input_container-input password_input"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
