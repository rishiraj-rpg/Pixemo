import React, { useState } from "react";
import logo2 from "../../Images/Logo_2.png";
import "./Navbar.css";
import { BsSearch } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { globalContext } from "./../../globalState";
import axios from "axios";

const Navbar = () => {
  const {
    loggedin,
    setLoggedin,
    currentUser,
    setCurrentUser,
    searchTerm,
    setSearchTerm,
  } = useContext(globalContext);

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
      setLoggedin(true);
    }
  }, []);

  const location = useLocation().pathname;

  const history = useNavigate();

  const logout = () => {
    axios
      .get("http://localhost:5000/api/v1/auth/logout", {
        withCredentials: true,
      })
      .then((resp) => {
        window.localStorage.clear();
        console.log(resp);
        setLoggedin(false);
        setCurrentUser({});
        history("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("search term", value);
  };

  return (
    <div className="navbar_container">
      <img className="logo2" alt="logo" src={logo2}></img>
      {loggedin ? (
        <ul className="link_container_left">
          <li>
            <Link
              to="/home"
              className={location === "/home" ? "active link" : "link"}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/createpost"
              className={location === "/createpost" ? "active link" : "link"}
            >
              Create
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="link_container_left">
          <li>
            <Link
              to="/login"
              className={location === "/login" ? "active link" : "link"}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className={location === "/signup" ? "active link" : "link"}
            >
              Signup
            </Link>
          </li>
        </ul>
      )}
      {loggedin && (
        <div className="search_container">
          <BsSearch className="search_icon" />
          <input
            type="text"
            name="search"
            placeholder="Search...."
            className="search_input"
            onChange={handleChange}
          />
        </div>
      )}
      {loggedin && (
        <ul className="link_container_right">
          <Link to="/profile">
            <img
              src={
                currentUser.profileImageURL
                  ? currentUser.profileImageURL
                  : `https://ui-avatars.com/api/?name=${currentUser.name}&size=45&color=random&rounded=true&bold=true`
              }
              alt=""
              className={
                location === "/profile"
                  ? "active_profile nav_profile_pic"
                  : "nav_profile_pic"
              }
            />
          </Link>
          <li onClick={logout}>
            <TbLogout className="logout-btn" />
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
