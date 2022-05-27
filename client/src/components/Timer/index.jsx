import React, { useState, useEffect } from "react";

function Timer() {
  const [counter, setCounter] = useState(30);

  useEffect(() => {
    setTimeout(() => {
      // TODO add a condition for submit click, restart click
      if (counter > 0) {
        setCounter(counter - 1);
      }
      return;
    }, 1000);
  });

  return (
    <div>
      <h3>Time:</h3>
      <div className="timer">{counter}</div>
    </div>
  );
}

export default Timer;
