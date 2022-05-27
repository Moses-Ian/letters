import React from 'react';
import "../../App.css";

// import 'bulma/css/bulma.min.css';

// import Register from '../Register';
// import Modal from 'react-bootstrap/Modal';
// import { Button } from 'react'


const Modal = props => {
    if (!props.show) {
        return null
    }


    return (
        <>
        <div className='modal-main' onClick={props.onClose}>
            <div className='modal-content' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h4 className='modal-title'>{props.title}</h4>
                </div>
                <div className='modal-body'>{props.children}</div>
                <div className='modal-footer'>
        
                    <button className='modal-enter-button'>Enter</button>
                    <button onClick={props.onClose} className='modal-close-button'>Close</button>
                    
                </div>
            </div>
        </div>


       
       
       </>
    )
}




export default Modal;