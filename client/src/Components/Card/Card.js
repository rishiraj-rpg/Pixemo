import React from "react";
import "./Card.css";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { useContext } from "react";
import { globalContext } from "./../../globalState";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";

const Card = ({ username, title, postImageURL, _id, bookmark, like }) => {
  const { active } = useContext(globalContext);

  const [isLike, setIsLike] = useState(false);
  const [isdelete, setIsDelete] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const savePost = () => {
    setIsBookmark(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = {
      id: user._id,
    };

    if (bookmark && bookmark[_id]) {
      axios
        .post(`http://localhost:5000/api/v1/post/${_id}/unsave`, userId, {
          withCredentials: true,
        })
        .then((resp) => {
          alert("Un-bookmarked Post!!");
          setIsBookmark(false);
          console.log(resp.data.user);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post(`http://localhost:5000/api/v1/post/${_id}/save`, userId, {
          withCredentials: true,
        })
        .then((resp) => {
          alert("Bookmarked Post!!");
          console.log(resp.data.user);
        })
        .catch((err) => console.log(err));
    }
  };

  const deletePost = () => {
    axios
      .delete(`http://localhost:5000/api/v1/post/${_id}`, {
        withCredentials: true,
      })
      .then((resp) => {
        alert("Deleted Post!!");
        console.log(resp.data.msg);
      })
      .catch((err) => console.log(err));
  };

  const likePost = () => {
    if (isLike) {
      setIsLike(false);
    } else {
      setIsLike(true);
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = {
      id: user._id,
    };
    if (like && like[_id]) {
      axios
        .post(`http://localhost:5000/api/v1/post/${_id}/unlike`, userId, {
          withCredentials: true,
        })
        .then((resp) => {
          alert("Un-liked Post!!");
          console.log(resp.data.user);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post(`http://localhost:5000/api/v1/post/${_id}/like`, userId, {
          withCredentials: true,
        })
        .then((resp) => {
          alert("Liked Post!!");
          console.log(resp.data.user);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="card_container" data-aos="fade-up" data-aos-once="true">
      <div className="card_header">
        <p className="card_title"></p>
        <div className="card_icon-container">
          {active === "posts" && (
            <div
              className="icon_delete"
              onMouseEnter={() => setIsDelete(true)}
              onMouseLeave={() => setIsDelete(false)}
              onClick={deletePost}
            >
              {isdelete ? <AiFillDelete /> : <AiOutlineDelete />}
            </div>
          )}
          <div className="icon_bookmark" onClick={savePost}>
            {bookmark && bookmark[_id] ? (
              <BsFillBookmarkFill />
            ) : isBookmark ? (
              <BsFillBookmarkFill />
            ) : (
              <BsBookmark />
            )}
          </div>
          <div className="icon_heart" onClick={likePost}>
            {like && like[_id] ? (
              <AiFillHeart />
            ) : isLike ? (
              <AiFillHeart />
            ) : (
              <AiOutlineHeart />
            )}
          </div>
        </div>
      </div>

      <Link style={{ display: "block" }} to={`/post/${_id}`}>
        <LazyLoadImage
          src={postImageURL}
          alt=""
          className="card_image"
          effect="blur"
        />
      </Link>
    </div>
  );
};

export default Card;
