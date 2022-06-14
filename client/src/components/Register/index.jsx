import React, { useState } from "react";
import Modal from "../Modal";
import "../../App.css";

//graphql
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { ADD_USER } from "../../utils/mutations";
import { sanitize } from "../../utils";

export default function Register() {
  const [show, setShow] = useState(false);

  // Ian's cool graphql code
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [addUser] = useMutation(ADD_USER);
  const [errorMsg, setErrorMsg] = useState(false);
	const [usernameErrorMsg, setUsernameErrorMsg] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await addUser({
        variables: {
          email: sanitize(formState.email, { lower: true }),
          password: formState.password,
          username: sanitize(formState.username),
        },
      });
      const token = mutationResponse.data.addUser.token;
      Auth.login(token);
			setErrorMsg(false);
    } catch (e) {
      console.error(e);
			const code = e.message.split(' ')[0];
			if (code === 'E11000')
				setErrorMsg('That username or email is taken.');
			else
				setErrorMsg('Please be sure to type a username, a valid email and at least a 5 character password.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <>
      <div className="Register">
        <button className="sign-up-button" onClick={() => setShow(true)}>
          {" "}
          Sign Up{" "}
        </button>
        <form onSubmit={handleFormSubmit}>
          <Modal title="Sign up" onClose={() => setShow(false)} show={show}>
            <div>
              <input
                autoFocus
                className="type-box input"
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              ></input>
            </div>
            <div>
              <input
                className="type-box input"
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
              ></input>
            </div>
            <div>
              <input
                className="type-box input"
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              ></input>
              {errorMsg ? (
                <div className="modal-error-msg">
									{errorMsg}
                </div>
              ) : (
                ""
              )}
            </div>
          </Modal>
        </form>
      </div>
    </>
  );
}
