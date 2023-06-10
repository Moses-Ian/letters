import React from "react";
import "../../App.css";

const Modal = ({ onClose, title, submitText, children, hideEnterButton=false }) => {


  return (
		<div className="modal-main" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="p-2">
					<h4 className="modal-title">{title}</h4>
				</div>

				<div className="modal-body">{children}</div>

				<div className="p-2">
					{!hideEnterButton && <button className="l3tters-btn">{submitText || "Enter"}</button>}
					<button onClick={onClose} className="l3tters-btn">
						Close
					</button>
				</div>
			</div>
		</div>
  );
};

export default Modal;
