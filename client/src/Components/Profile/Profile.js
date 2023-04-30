import React from "react";
import "./Profile.css";
import { useEffect, useState, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import Posts from "./../Posts/Posts";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { globalContext } from "./../../globalState";
import axios from "axios";

const Profile = () => {
  const { active, setActive, currentUser, setCurrentUser } =
    useContext(globalContext);

  const [file, setFile] = useState();
  const [fileURL, setFileURL] = useState();
  const [show, setShow] = useState(true);
  const [profilepic, setProfilepic] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [data, setData] = useState([]);

  const handleMyPosts = async () => {
    setActive("posts");
    await axios
      .get("http://localhost:5000/api/v1/post", {
        withCredentials: true,
      })
      .then((resp) => {
        setMyPosts(resp.data.posts);
        const id = currentUser._id;
        const filteredPosts = resp.data.posts.filter(
          (post) => post.author === id
        );
        setData(filteredPosts);
      });
  };

  useEffect(() => {
    document.title = "Profile";
    const user = window.localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, [setActive]);

  function handleChange(e) {
    setFile(e.target.files[0]);
    setFileURL(URL.createObjectURL(e.target.files[0]));
    setShow(false);
    setProfilepic(true);
  }

  const handleDelete = () => {
    setFile();
    setShow(true);
    setProfilepic(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    await axios
      .post("http://localhost:5000/api/v1/profile", formData, {
        withCredentials: true,
      })
      .then((resp) => {
        // console.log("updated user", resp.data.user);
        axios
          .get("http://localhost:5000/api/v1/profile", {
            withCredentials: true,
          })
          .then((resp) => {
            window.localStorage.setItem("user", JSON.stringify(resp.data.user));
            // console.log("final updated user", resp.data.user);
            setShow(true);
            setProfilepic(false);
          });
      })
      .catch((err) => console.log(err));
  };

  const handleSavedPosts = async () => {
    setActive("saved");
    await axios
      .get("http://localhost:5000/api/v1/profile/posts", {
        withCredentials: true,
      })
      .then((resp) => {
        // console.log("saved posts", resp.data.user.savedPosts);
        setData(resp.data.user.savedPosts);
      });
  };

  return (
    <div className="profile_main-container">
      <a href="#" className="scroll-up_btn">
        <BsFillArrowUpCircleFill />
      </a>
      <div id="#" className="profile_container">
        {!profilepic ? (
          <img
            src={
              currentUser.profileImageURL
                ? currentUser.profileImageURL
                : `https://ui-avatars.com/api/?name=${currentUser.name}&size=45&color=random&rounded=true&bold=true`
            }
            alt="Profile Pic"
            className="uploaded-profile-pic"
          />
        ) : (
          <img src={fileURL} alt="" className="uploaded-profile-pic" />
        )}
        <div className="profile_pic-container">
          <form onSubmit={handleSubmit}>
            {show && (
              <div>
                <input
                  id="file_input"
                  type="file"
                  multiple="false"
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />
                <label
                  for="file_input"
                  className="submit-btn profile-submit-btn"
                >
                  Change
                </label>
              </div>
            )}
            {!show && (
              <div className="profile_icon-container">
                <div
                  className="profile_icon delete_icon"
                  onClick={handleDelete}
                >
                  <MdDelete />
                </div>
                <button
                  type="submit"
                  className="profile_icon tick_icon"
                >
                  <TiTick />
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="user_details">
          <div className="name">{currentUser.name}</div>
          <div className="username">@{currentUser.username}</div>
        </div>
        <div className="navbar2">
          <ul className="link_container_left link_container_navbar2">
            <li
              className={active === "posts" ? "active link" : "link"}
              onClick={handleMyPosts}
            >
              Post
            </li>
            <li
              className={active === "saved" ? "active link" : "link"}
              onClick={handleSavedPosts}
            >
              Saved
            </li>
          </ul>
        </div>
      </div>
      <Posts data={data} />
    </div>
  );
};

export default Profile;
