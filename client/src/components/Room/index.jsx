import React from "react";

import Header from "../Header";

function Room({ username }) {
  console.log("Room rendered");

  return (
    <div>
      <Header username={username} />
    </div>
  );
}

export default Room;
