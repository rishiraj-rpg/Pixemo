import React, { useEffect, useState } from "react";
import Posts from "./../Posts/Posts";
import { useContext } from "react";
import { globalContext } from "./../../globalState";

const Home = () => {
  const { setActive } = useContext(globalContext);

  useEffect(() => {
    document.title = "Home";
    setActive("home");
  }, []);

  return <Posts />;
};

export default Home;
