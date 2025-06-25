import React, { useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import {TypeAnimation} from 'react-type-animation'

const HomePage = () => {
  const [typingStatus, setTypingStatus]= useState("human1");
  return (
    <div className="homepage">
      <img src="orbital.png" alt="background" className="orbital" />
      <div className="left">
        <h1>LUMINO AI</h1>
        <h2>Supercharge your creativity and productivty.</h2>
        <h3>
          Your ultimate AI companion, transforming creativity and productivity
          across every sector with innovative, tailored solutions.
        </h3>
        <Link to="/dashboard">
          <button>Get Started</button>
        </Link>
      </div>
      <div className="right">
        <div className="img-container">
          <div className="bg-container">
            <div className="bg"></div>
          <img src="/bot.png" alt="bot" className="bot" />
          </div>
          <div className="chat">
            <img src={
              typingStatus==="human1" ?
              "human1.jpeg" :
              typingStatus==="human2" ?
              "human2.jpeg" :
              "bot.png"
            } alt="" />
            <TypeAnimation
              sequence={[
                "Human: We produce food for Mice",
                2000, ()=>{setTypingStatus("bot")},
                "Bot: We produce food for Hamsters",
                2000, ()=>{setTypingStatus("human2")},
                "Human: We produce food for Guinea Pigs",
                2000, ()=>{setTypingStatus("bot")},
                "Bot: We produce food for Chinchillas",
                2000, ()=>{setTypingStatus("human1")},
              ]}
              wrapper="span"
              style={{ fontSize: "1em", display: "inline-block" }}
              omitDeletionAnimation= {true}
              repeat={Infinity}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="logo.png" alt="logo" />
        <span>
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </span>
      </div>
    </div>
  );
};

export default HomePage;
