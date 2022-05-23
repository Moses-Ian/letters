import React, { useState } from 'react';
import Modal from '../Modal';
// import 'bulma/css/bulma.min.css';


export default function LandingPage(Modal1, Modal2) {
    const [show, setShow] = useState(false)

    // const [isLoginModalOpen, toggleLoginModal] = useState(false);
    // const [isRegisterModalOpen, toggleRegisterModal] = useState(false);

    // const [ShowModal1, setShowModal1] = useState(false);
    // const [ShowModal2, setShowModal2] = useState(false);
  
    return (
    <>
        
    <div className='LandingPage'>

        <div className='container1'>
            <div className='center1'>
                <button className='modal-toggle-button' onClick={() => setShow(true) }>Login / Register</button>
            </div>
        </div>

        <Modal title='Login' onClose={() => setShow(false)} show={show}>
            <div>
                <input className='type-box' type="email" placeholder="Email"></input>
                <input className='type-box' type="password" placeholder="Password"></input>
            </div>
        </Modal>
   

        <br></br>


        <Modal title='Register' onClose={() => setShow(false)} show={show}>
            <div>
                <input className="type-box" type="text" placeholder="Username"></input>
                <input className='type-box' type="email" placeholder="Email"></input>
                <input className='type-box' type="password" placeholder="Password"></input>
            </div>
        </Modal>
    </div>

    {/* <div className='container1'> */}
        <div className='center'>
            <button className='game-btn'>Join Game</button>
        </div>
    {/* </div> */}


    </>

    );
  }






