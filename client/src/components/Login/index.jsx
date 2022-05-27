import React, { useState } from 'react';
import Modal from '../Modal';
// import userImg from '../../assets/images/user.png';
// import logoutImg from '../../assets/images/logout2.png';
import '../../App.css';

import Register from '../Register';

//graphql
import { useMutation } from '@apollo/client';
import Auth from '../../utils/auth';
import { LOGIN } from '../../utils/mutations';


export default function Login() {
    const [show, setShow] = useState(false)

    // const [isLoginModalOpen, toggleLoginModal] = useState(false);
    // const [isRegisterModalOpen, toggleRegisterModal] = useState(false);

    // const [ShowModal, setShowModal] = useState(false);
    // const [ShowModal2, setShowModal2] = useState(false);
		
		// Ian's cool graphql code
		//====================================================

  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

		//====================================================
  
    return (
        <>
    
        <div className='Login'>
            {/* <button className='modal-toggle-button' onClick={() => setShow(true) }><img className='user-img' src={userImg} alt='login button' /></button> */}

            <button className='modal-toggle-button' onClick={() => setShow(true) }>Login</button>
            <Register />
            <button className='modal-toggle-button' onClick={() => Auth.logout()}>Logout</button>

						<form onSubmit={handleFormSubmit}>
              <Modal title='Login' onClose={() => setShow(false)} show={show}>
                    <div>
                        <input 
													className='type-box' 
													type="email" 
													placeholder="Email"
													name="email"
													onChange={handleChange}
												></input>
                    </div>
                    <div>
                        <input 
													className='type-box' 
													type="password" 
													placeholder="Password"
													name="password"
													onChange={handleChange}
												></input>
                    </div>
              </Modal> 
              
              
						</form>
        </div>

        </>

    );
  }

