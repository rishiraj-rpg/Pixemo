import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { globalContext } from './../../globalState';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'
import img1 from '../../Images/river.jpg'
import img2 from "../../Images/lake.jpg";
import img3 from "../../Images/dog.jpg";
import img4 from "../../Images/caption.png";
import img5 from "../../Images/comment.png";
// import vid1 from "../../Images/Image Captioning.mp4"
// import vid2 from "../../Images/Emoji Generation.mp4";

const Dashboard = () => {
  const { loggedin, setActive } = useContext(globalContext);
  const history = useNavigate();

  useEffect(() => {
  document.title = "Pixemo";
  if (loggedin === true) {
    history("/home");
    setActive("home");
  }
  }, [loggedin]);

  return (
    <>
      <div className="container1">
        <h1 className="header1">Express Yourself with Ease!!</h1>
        <p className="para1">
          Unlock the power of captivating captions and creative emojis with our
          automatic generator.
        </p>
        <button
          type="submit"
          className="submit-btn"
          onClick={() => history("/login")}
        >
          Get Started
        </button>
        <img src={img1} alt="" className="image1" />
        <img src={img2} alt="" className="image2" />
      </div>

      <div className="container2">
        <div className="container2_left container2_flex">
          <img src={img3} alt="" className="image3" />
          <img src={img4} alt="" className="image4" />
        </div>
        <div className="container2_right">
          <h2 className="header2">Caption the moment, effortlessly!</h2>
          <p className="para2">
            Say goodbye to the hassle of manually crafting captions and hello to
            the world of dynamic, creative and engaging story telling.
          </p>
          <button
            type="submit"
            className="submit-btn"
            onClick={() => history("/login")}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="container3">
        <div className="container3_left">
          <h2 className="header2">Emojis that Speak a Thousand Words!</h2>
          <p className="para2">
            Get emoji-savvy with our intuitive prediction - never struggle with
            choosing the right one!
          </p>
          <button
            type="submit"
            className="submit-btn"
            onClick={() => history("/login")}
          >
            Get Started
          </button>
        </div>
        <div className="container3_right">
          <img src={img5} alt="" className="image5" />
        </div>
      </div>
    </>
  );
}

export default Dashboard