import React, { useState, useReducer, useEffect, useRef } from "react";
import { sanitize } from "../../utils";
import swipeLeft from "../../assets/images/swipe-right7.png";
import { useL3ttersContext } from "../../utils/GlobalState";

const MAX_MESSAGE_LENGTH = 80;

// LiveChat is going to take in Room as a prop
function LiveChat({ display }) {
	const { socket, username, room } = useL3ttersContext();
	
  useEffect(() => {
    socket.on("receive-message", recieveMessage);
  }, [socket]);

  const elementRef = useRef();
	const textareaRef = useRef();

  const [formState, setFormState] = useState({ message: "" });
  const [messages, setMessages] = useReducer(messageReducer, []);
	const [rows, setRows] = useReducer(rowReducer, 1);

  useEffect(() => {
		if (display !== 'active-view')
			return;
		elementRef.current.scrollIntoView({
      // behavior: "smooth",	// smooth scroll just suddenly stopped working?
			block: "end", 
			inline: "nearest"
		});
	// eslint-disable-next-line
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
	
	function rowReducer(rows, action) {
		let newRows;
		switch (action.type) {
			case "INCREMENT":
				newRows = rows < 3 ? rows + 1 : rows;
				break;
			case "RESET":
				newRows = 1;
				break;
			default:
				throw new Error();
		}
		return newRows;
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
		setRows({ type: "RESET" });
    //socket.emit
    socket.emit("send-message", formState.message.trim(), username, room);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
		if (value[value.length-1] === "\n" || value[value.length-1] === "\r")
			return handleFormSubmit(event);
    if (value.length > MAX_MESSAGE_LENGTH) return;
    //optionally, flash red or something
    setFormState({
      ...formState,
      [name]: value,
    });
		if (textareaRef.current.scrollHeight > textareaRef.current.clientHeight)
			setRows({ type: "INCREMENT" });
  };
	
	const handleBlur = event => {
		setRows({ type: "RESET" });
	}

  const recieveMessage = (username, message) => {
    setMessages({
      type: "PUSH",
      message,
      username,
    });
    console.log(`receive ${message}`);
  };
	
  return (
    <div className={`view ${display}`}>
	    <div className="live-chat-header is-flex-direction-column">
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
					{/* <label>Chat:</label> */}
					<textarea
						ref={textareaRef}
            placeholder="Message"
						className="live-chat-input ml-2"
						type="text"
						id="message-input"
						value={formState.message}
						name="message"
						onChange={handleChange}
						rows={rows}
						onBlur={handleBlur}
					/>
					<button className="live-chat-button mr-2" type="submit" id="send-button">
						Send
					</button>
				</form>
			</div>
			<p className="swipe-arrows"><span className="arrow-image1"><img src={swipeLeft} alt="left arrow"/></span> Swipe to play</p>
		</div>
  );
}

export default LiveChat;
