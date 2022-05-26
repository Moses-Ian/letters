import React, { useState } from 'react';
import Modal2 from '../Modal-2';
import '../../App.css';


export default function JoinGame() {
    const [show, setShow] = useState(false)


    return (
        <>

        <div className='JoinGame'>
            <button className='join-game-button' onClick={() => setShow(true) }> Join Game </button>
        
                <Modal2 title='Join Game' onClose={() => setShow(false)} show={show}>
                    <div>
                        <p> Enter whatever body we need in here/ Create another Modal for Game so can remove buttons, maybe another one for register also</p>
                    </div>
                </Modal2>
            
        </div>
        
        </>
    );
}