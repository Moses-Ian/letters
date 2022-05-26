import React, { useState } from 'react';
import Modal from '../Modal';
// import userImg from '../../assets/images/user.png';
// import logoutImg from '../../assets/images/logout2.png';
import '../../App.css';

import Register from '../Register';


export default function Login() {
    const [show, setShow] = useState(false)

    // const [isLoginModalOpen, toggleLoginModal] = useState(false);
    // const [isRegisterModalOpen, toggleRegisterModal] = useState(false);

    // const [ShowModal, setShowModal] = useState(false);
    // const [ShowModal2, setShowModal2] = useState(false);
  
    return (
        <>
    
        <div className='Login'>
            {/* <button className='modal-toggle-button' onClick={() => setShow(true) }><img className='user-img' src={userImg} alt='login button' /></button> */}
            <button className='modal-toggle-button' onClick={() => setShow(true) }>Login</button>
            <Register />
            {/* TODO Add functionality to logout */}
            {/* <button className='modal-toggle-button'><img className='logout-img' src={logoutImg} alt='logout button' /></button> */}
            <button className='modal-toggle-button'>Logout</button>
            

                <Modal title='Login' onClose={() => setShow(false)} show={show}>
                    <div>
                        <input className='type-box' type="email" placeholder="Email"></input>
                        <input className='type-box' type="password" placeholder="Password"></input>
                        {/* <Register /> */}
                    </div>
                </Modal> 
                
        </div>

        </>

    );
  }

