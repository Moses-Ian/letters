import React, { useState } from 'react';
import Modal from '../Modal';
// import 'bulma/css/bulma.min.css';



// MOVE TO LANDINGPAGE
export default function LandingPage() {
    const [show, setShow] = useState(false)
  
    return (
        
      <div className='LandingPage'>
        <button onClick={() => setShow(true) }>Login</button>
        <Modal title='Login' onClose={() => setShow(false)} show={show}>
            <input className="input is-small mt-3" type="email" placeholder="Email"></input>
            <input className="input is-small mt-3" type="password" placeholder="Password"></input>
        </Modal>
      </div>
    )
  }

