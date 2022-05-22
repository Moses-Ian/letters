import React from 'react';
import "../../App.css";
// import 'bulma/css/bulma.min.css';
// import { Button } from 'bulma'


const Modal = props => {
    if (!props.show) {
        return null
    }

    
    return (
       <div className={`modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
            <div className='modal-content' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h4 className='modal-title'>{props.title}</h4>
                </div>
                <div className='modal-body'>{props.children}</div>
                <div className='modal-footer'>
                    {/* TODO enter button should not be on close add function to landingPage */}
                    <button onClick={props.onClick} className='modal-enter-button'>Enter</button>
                    <button onClick={props.onClose} className='modal-close-button'>Close</button>
                </div>
            </div>
       </div>
       
        
    )
}




export default Modal;