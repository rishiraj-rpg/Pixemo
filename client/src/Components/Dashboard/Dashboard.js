import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { globalContext } from "./../../globalState";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import img1 from "../../Images/river.jpg";
import img2 from "../../Images/lake.jpg";
import img3 from "../../Images/dog.jpg";
import img4 from "../../Images/caption.png";
import img5 from "../../Images/comment.png";
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
  const { loggedin, setActive } = useContext(globalContext);
  const history = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    document.title = "Pixemo";
    if (loggedin === true) {
      history("/home");
      setActive("home");
    }
  }, [loggedin]);

  return (
    <div className="dashboard_main-container">
      <div className="container1">
        <h1 className="header1" data-aos="fade-up">
          Express Yourself with Ease!!
        </h1>
        <p className="para1" data-aos="fade-up">
          Unlock the power of captivating captions and creative emojis with our
          automatic generator.
        </p>
        <button
          type="submit"
          className="submit-btn"
          data-aos="fade-up"
          onClick={() => history("/login")}
        >
          Get Started
        </button>
        <div>
          <img src={img1} alt="" className="image1" />
        </div>
        <div>
          <img src={img2} alt="" className="image2" />
        </div>
      </div>

      <div className="container2">
        <div className="container2_left container2_flex">
          <img src={img3} alt="" className="image3" data-aos="fade-right" />
          <img src={img4} alt="" className="image4" data-aos="fade-right" />
        </div>
        <div className="container2_right" data-aos="fade-left">
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
        <div className="container3_left" data-aos="fade-right">
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
        <div className="container3_right" data-aos="fade-left">
          <img src={img5} alt="" className="image5" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
