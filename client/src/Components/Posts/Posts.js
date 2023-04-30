import React, { useEffect, useState, useContext } from "react";
import "./Posts.css";
import Card from "./../Card/Card";
import { globalContext } from "./../../globalState";
import axios from "axios";

const Posts = (props) => {
  const { active, searchTerm } = useContext(globalContext);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState();
  const [likedPosts, setLikedPosts] = useState();

  const { data } = props;

  var savedPostMap = {};
  var likedPostMap = {};

  useEffect(() => {
    if (data) {
      setPosts(data);
      axios
        .get("http://localhost:5000/api/v1/profile/posts", {
          withCredentials: true,
        })
        .then((resp2) => {
          //checking for posts saved by the user
          for (let spost of resp2.data.user.savedPosts) {
            for (const post of data) {
              if (spost._id === post._id) {
                savedPostMap[spost._id] = true;
                break;
              }
            }
          }
          setSavedPosts(savedPostMap);

          //checking for the posts liked by the user
          for (let spost of resp2.data.user.likedPosts) {
            for (const post of data) {
              if (spost === post._id) {
                likedPostMap[spost] = true;
                break;
              }
            }
          }
          setLikedPosts(likedPostMap);
        });
    } else if (searchTerm) {
      axios
        .get("http://localhost:5000/api/v1/post", {
          withCredentials: true,
        })
        .then((resp1) => {
          const term = searchTerm.toLowerCase();
          const filterredPosts = resp1.data.posts.filter(
            (post) =>
              (post.caption && post.caption.toLowerCase().includes(term)) ||
              (post.tags && post.tags.toLowerCase().includes(term)) ||
              (post.username && post.username.toLowerCase().includes(term))
          );
          console.log("filter", filterredPosts);
          setPosts(filterredPosts);
        });
    } else {
      axios
        .get("http://localhost:5000/api/v1/post", {
          withCredentials: true,
        })
        .then((resp1) => {
          setPosts(resp1.data.posts);
          axios
            .get("http://localhost:5000/api/v1/profile/posts", {
              withCredentials: true,
            })
            .then((resp2) => {
              //checking for posts saved by the user
              for (let spost of resp2.data.user.savedPosts) {
                for (const post of resp1.data.posts) {
                  if (spost._id === post._id) {
                    savedPostMap[spost._id] = true;
                    break;
                  }
                }
              }
              setSavedPosts(savedPostMap);

              //checking for the posts liked by the user
              for (let spost of resp2.data.user.likedPosts) {
                for (const post of resp1.data.posts) {
                  if (spost === post._id) {
                    likedPostMap[spost] = true;
                    break;
                  }
                }
              }
              setLikedPosts(likedPostMap);
            });
        });
    }
  }, [data, searchTerm]);

  return (
    <div className="card_main_container1">
      <div
        className={
          active === "home"
            ? "card_main_container2 more_margin"
            : "card_main_container2 "
        }
      >
        {posts.length === 0 ? (
          <div>
            <p style={{ fontSize: "25px" }}>No posts to display!!</p>
          </div>
        ) : (
          posts.map((post, index) => {
            return (
              <Card
                key={index}
                {...post}
                bookmark={savedPosts}
                like={likedPosts}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Posts;
