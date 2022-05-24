import React from "react";
import MainGame from "./components/MainGame";
import Room from "./components/Room";
import Header from "./components/Header";
// import React, { useState } from 'react';
import "./App.css";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <div className="App">
      <Header />

      {/* <MainGame room={room} /> */}
      <MainGame />

      <LandingPage />
    </div>
  );
}

export default App;
