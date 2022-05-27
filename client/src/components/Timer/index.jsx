import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer";

function Timer() {
  // const [counter, setCounter] = useState(30);

  // useEffect(() => {
  //   setTimeout(() => {
  //     // TODO add a condition for submit click, restart click, next round click
  //     // QUESTION - condition based on active turn or button clicks?
  //     if (counter > 0) {
  //       setCounter(counter - 1);
  //     }
  //     return;
  //   }, 1000);
  // });

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">0</div>;
    }

    return (
      <div className="timer">
        {/* <div className="text">Remaining</div> */}
        <div className="value">{remainingTime}</div>
        {/* <div className="text">seconds</div> */}
      </div>
    );
  };

  return (
    <div>
      {/* <div className="timer">{counter}</div> */}

      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={30}
          size={90}
          strokeWidth={8}
          // colors={["#fce181", "#fef9c7", "#026670"]}
          colors={"#fce181"}
          // colorsTime={[10, 6, 0]}
          onComplete={() => ({ shouldRepeat: false, delay: 1 })}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
}

export default Timer;
