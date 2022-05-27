import React from "react";
import "../../App.css";

const Modal2 = (props) => {
  if (!props.show) {
    return null;
  }

  return (
    <>
      <div onClick={props.onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">{props.title}</h4>
          </div>
          <div className="modal-body">{props.children}</div>

          <div className="modal-footer">
            {/* TODO add functionality to join game (what is now in the "join game" button in Room component) */}
            <button onClick={props.onSubmit} className="modal-enter-button">
              Enter
            </button>
            <button onClick={props.onClose} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal2;
