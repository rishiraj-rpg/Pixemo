import React from "react";
import "./Comment.css";
const moment = require("moment");

const Comment = ({ body, author, createdAt }) => {
  return (
    <div className="comment_container">
      <img
        src={
          author.authorImageURL
            ? author.authorImageURL
            : `https://ui-avatars.com/api/?name=${author.name}&size=45&color=random&rounded=true&bold=true`
        }
        alt="profile pic"
        className={author.authorImageURL ? "profile-img" : ""}
      />
      <div className="comment_right_container">
        <p className="comment_username">{author.username}</p>
        <p className="comment">{body}</p>
        <p style={{color:"gray"}}>{moment(createdAt).format("lll")}</p>
      </div>
    </div>
  );
};

export default Comment;
