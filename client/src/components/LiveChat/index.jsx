import React, { useState, useReducer, useEffect, useRef } from "react";
import { sanitize } from "../../utils";

const MAX_MESSAGE_LENGTH = 80;

// LiveChat is going to take in Room as a prop
function LiveChat({ socket, username, room, display }) {
  useEffect(() => {
    socket.on("receive-message", recieveMessage);
  }, [socket]);

  const elementRef = useRef();

  const [formState, setFormState] = useState({ message: "" });
  const [messages, setMessages] = useReducer(messageReducer, []);

  useEffect(() => {
    elementRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  function messageReducer(messages, action) {
    let newMessages;
    switch (action.type) {
      case "PUSH":
        const { username, message } = action;
        newMessages = [...messages, { username, message }];
        break;
      case "CLEAR":
        newMessages = [];
        break;
      case "RENDER_MESSAGES":
        newMessages = [...action.messages];
        break;
      default:
        throw new Error();
    }
    return newMessages;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (formState.message.trim() === "") return;
    //append message to element
    setMessages({
      type: "PUSH",
      message: sanitize(formState.message),
      username,
    });
    setFormState({ message: "" });
    //socket.emit
    socket.emit("send-message", formState.message.trim(), username, room);
    console.log(`submit ${formState.message}`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value.length > MAX_MESSAGE_LENGTH) return;
    //optionally, flash red or something
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const recieveMessage = (username, message) => {
    setMessages({
      type: "PUSH",
      message,
      username,
    });
    console.log(`receive ${message}`);
  };
	
  return (
    <div className="live-chat-header is-flex-direction-column" style={{'display':display?'block':'none'}}>
      <div className="live-chat-message" id="message-container">
        {messages.map((m, index) => (
          <p key={index}>
            <span
              className={
                "username-chat " +
                (username === m.username ? "me-in-chat" : "not-active")
              }
            >
              {m.username}:{" "}
            </span>
            <span>{m.message}</span>
          </p>
        ))}
        <div ref={elementRef}></div>
      </div>
      <form
        className="live-chat chat-form"
        id="form"
        onSubmit={handleFormSubmit}
      >
        <label>Chat:</label>
        <input
          className="live-chat-input ml-2"
          type="text"
          id="message-input"
          value={formState.message}
          name="message"
          onChange={handleChange}
        />
        <button className="live-chat-button" type="submit" id="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default LiveChat;
