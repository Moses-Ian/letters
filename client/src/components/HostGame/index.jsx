import React, { useState } from "react";

function HostGame() {
  const [inputValue, setInputValue] = useState("");

  const selectRoomName = () => {
    console.log("Host Game clicked");
    // const input = React.createElement("input", {}, inputValue);
  };

  return (
    <div>
      <button className="button" onClick={selectRoomName}>
        Host Game
      </button>
    </div>
  );
}

export default HostGame;
