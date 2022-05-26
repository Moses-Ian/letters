import React, { useState } from 'react';
import Modal from '../Modal';
import '../../App.css';


export default function Register() {
    const [show, setShow] = useState(false)


    return (
        <>

        <div className='Register'>
            <button className='sign-up-button' onClick={() => setShow(true) }> Sign Up </button>
           
                <Modal title='Sign up' onClose={() => setShow(false)} show={show}>
                    <div>
                        <input className="type-box" type="text" placeholder="Username"></input>
                        <input className='type-box' type="email" placeholder="Email"></input>
                        <input className='type-box' type="password" placeholder="Password"></input>
                    </div>
                </Modal>
            
        </div>
        
        </>
    );
}