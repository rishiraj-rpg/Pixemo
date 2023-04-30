import React, { useState, useEffect } from "react";
import "./Post.css";
import { useParams } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import Comment from "./../Comment/Comment";
import Posts from "./../Posts/Posts";
import axios from "axios";
import { MdPlayArrow } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";

const Post = () => {
  const [comment, setComment] = useState({ comment: "" });
  const [singlePost, setSinglePost] = useState({});
  const [userComments, setUserComments] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const generateEmoji = () => {
    setEmojis([]);
    setLoading(true);
    axios
      .post("http://localhost:8080/emoji_prediction", comment, {
        withCredentials: true,
      })
      .then((res) => {
        const pred_emoji = res.data.data;
        setEmojis(pred_emoji);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("comment submitted");

    axios
      .post(`http://localhost:5000/api/v1/posts/${id}/comments/`, comment, {
        withCredentials: true,
      })
      .then((resp) => {
        setComment({ comment: "" });
        setEmojis([]);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setComment({ ...comment, [name]: value });
  };

  const selectEmoji = (emoji) => {
    const input = document.getElementsByClassName("comment_input");
    let position = 0;

    console.log(position);

    if (input) {
      position = input[0].selectionStart;
    }

    if (position === 0) {
      position = comment.comment.length;
    }

    const updatedComment =
      comment.comment.substring(0, position) +
      emoji +
      comment.comment.substring(position);

    console.log(updatedComment);
    setComment({ comment: updatedComment });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/post/${id}`, {
        withCredentials: true,
      })
      .then((resp) => {
        setSinglePost(resp.data.post);
        resp.data.post.comments.reverse();
        setUserComments(singlePost.comments);
      });
  }, [comment, singlePost]);

  return (
    <div className="post_outer_container">
      <div className="post_flex_container2">
        <div className="post_main_container2">
          <div className="post_left_container2">
            <img src={singlePost.postImageURL} alt="" className="post-image" />
          </div>
          <div className="post_right_container2">
            <div className="post_header">
              <p className="post_title">
                {singlePost.author && singlePost.author.username}
              </p>
              <div className="card_icon-container">
                <div className="post_icon_heart">
                  {singlePost.likeCount > 0 && (
                    <div>
                      <AiFillHeart />
                      <p className="like_count">{singlePost.likeCount}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="caption_container">
              {singlePost.caption}
              <br />
              <br />
              {singlePost.tags}
            </div>
            {singlePost.comments && userComments ? (
              userComments.length > 0 ? (
                <div>
                  <h4 className="comments_title">Comments</h4>
                  <div className="comments_main_container">
                    {singlePost.comments &&
                      singlePost.comments.map((comm, index) => {
                        return <Comment key={index} {...comm} />;
                      })}
                  </div>
                </div>
              ) : null
            ) : null}
            <form action="" className="comment_form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="comment"
                className="post_input_container-input comment_input"
                placeholder="Type out a comment..."
                onChange={handleChange}
                value={comment.comment}
                required
              />
              <div className="comment_form_icons">
                {comment.comment != "" ? (
                  <BsEmojiSmile
                    className="comment_icon"
                    onClick={generateEmoji}
                  />
                ) : null}

                <button type="submit" className="comment_form_btn">
                  <MdPlayArrow
                    className="comment_icon"
                    style={{ fontSize: "30px" }}
                  />
                </button>
              </div>
            </form>
            {loading && (
              <div className="loader_container emoji_loader">
                Predicting Emoji
                <div className="loader"></div>
              </div>
            )}
            <div className="emoji_container">
              {emojis.map((emoji) => {
                return (
                  <div
                    className="comment_emoji_btn"
                    onClick={() => selectEmoji(emoji)}
                  >
                    {emoji}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
