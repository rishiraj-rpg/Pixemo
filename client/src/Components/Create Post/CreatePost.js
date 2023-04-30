import React, { useEffect, useState, useRef } from "react";
import "./CreatePost.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  useEffect(() => {
    document.title = "Create Post";
  }, []);

  const [file, setFile] = useState();
  const [fileURL, setFileURL] = useState();
  const [postdata, setPostData] = useState({});
  const [postID, setPostID] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useNavigate();
  const inputRef = useRef(null);

  function handleChange(e) {
    setFile(e.target.files[0]);
    setFileURL(URL.createObjectURL(e.target.files[0]));
    setShowUpload(true);
    setShowBtn(true);
  }

  const handleChangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPostData({ ...postdata, [name]: value });
  };

  const handleDelete = () => {
    setFileURL("");
    setShowUpload(false);
    setShowBtn(false);
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("image", file);

    await axios
      .post("http://localhost:5000/api/v1/post/image", formData, {
        withCredentials: true,
      })
      .then((resp) => {
        console.log(resp.data);
        setPostID(resp.data.postId);
        setPostData({ ...postdata, id: resp.data.postId });
        console.log(resp.data.postImageURL);
        setShowBtn(false);
        setShowUpload(true);
        setLoading(true);
        axios
          .post(
            "http://localhost:8080/generate_caption",
            { imgURL: resp.data.postImageURL },
            {
              withCredentials: true,
            }
          )
          .then((resp) => {
            const caption = resp.data.data;
            console.log(caption);
            setPostData({ ...postdata, caption: caption });
            setLoading(false);
            axios
              .post(
                "http://localhost:8080/emoji_prediction",
                { comment: caption },
                {
                  withCredentials: true,
                }
              )
              .then((res) => {
                const pred_emoji = res.data.data;
                setEmojis(pred_emoji);
                console.log("emoji output:", pred_emoji);
                console.log(typeof pred_emoji);
              });
          });
      })
      .catch((err) => console.log(err));
  };

  const selectEmoji = (emoji) => {
    const input = document.getElementsByClassName("textarea");
    let position = 0;

    console.log(position);

    if (input) {
      position = input[0].selectionStart;
    }

    if (position === 0) {
      position = postdata.caption.length;
    }

    const updatedCaption =
      postdata.caption.substring(0, position) +
      emoji +
      postdata.caption.substring(position);

    console.log(updatedCaption);
    setPostData({ ...postdata, caption: updatedCaption });

    setShowUpload(true);
    setShowBtn(false);
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    console.log(postID);
    console.log(postdata);
    await axios
      .post(
        "http://localhost:5000/api/v1/post",
        { ...postdata, id: postID },
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        console.log(resp.data.post);
        setShowUpload(true);
        setShowBtn(false);
        history("/home");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="post_flex_container">
      <div className="post_main_container">
        <h1>Create Post</h1>
        <div className="post_container">
          <form className="post_left_container" onSubmit={handleSubmitImage}>
            <div className="canvas">
              {!showUpload && (
                <div className="upload_container">Upload Image</div>
              )}
              <img src={fileURL} className="uploaded-image" />
              {!showUpload && (
                <div>
                  <input
                    id="file_input"
                    type="file"
                    multiple="false"
                    accept="image/*"
                    onChange={handleChange}
                    hidden
                  />

                  <label for="file_input">
                    <AiOutlineCloudUpload className="upload_icon" />
                  </label>
                </div>
              )}
            </div>

            {showBtn && (
              <div className="profile_icon-container">
                <div className="delete_icon" onClick={handleDelete}>
                  <MdDelete />
                </div>
                <button type="submit" className="profile_icon tick_icon">
                  <TiTick />
                </button>
              </div>
            )}

            {loading && (
              <div className="loader_container">
                Generating Caption
                <div className="loader"></div>
              </div>
            )}
          </form>

          <form className="post_right_container">
            <div className="post_input_container">
              <label htmlFor="caption" className="post_input_container-label">
                Caption
              </label>
              <textarea
                name="caption"
                className="textarea post_input_container-input"
                onChange={handleChangeInput}
                value={postdata.caption}
                required
              />
            </div>

            {emojis.map((emoji) => {
              return (
                <div className="emoji_btn" onClick={() => selectEmoji(emoji)}>
                  {emoji}
                </div>
              );
            })}
            <div className="post_input_container" style={{ marginBottom: 0 }}>
              <label htmlFor="tags" className="post_input_container-label">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                className="post_input_container-input"
                onChange={handleChangeInput}
                required
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmitData}
              className="post submit-btn"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
