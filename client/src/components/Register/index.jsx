import React, { useState } from "react";
import Modal from "../Modal";
import "../../App.css";
import { useL3ttersContext } from "../../utils/GlobalState";

//graphql
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import { sanitize } from "../../utils";

export default function Register() {
	const { saveToken } = useL3ttersContext();
	
  const [show, setShow] = useState(false);

  // Ian's cool graphql code
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [addUser] = useMutation(ADD_USER);
  const [errorMsg, setErrorMsg] = useState(false);

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
			saveToken(token);
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
		<div className="Register">
			<button className="l3tters-btn modal-toggle-button" onClick={() => setShow(true)}>
				{" "}
				Sign Up{" "}
			</button>
			
			{show &&
				<form onSubmit={handleFormSubmit}>
					<Modal title="Sign up" onClose={() => setShow(false)}>
						<div>
							<input
								autoFocus
								className="type-box input"
								type="text"
								placeholder="Username"
								name="username"
								onChange={handleChange}
								autoComplete="username"
							></input>
						</div>
						<div>
							<input
								className="type-box input"
								type="email"
								placeholder="Email"
								name="email"
								onChange={handleChange}
								autoComplete="email"
							></input>
						</div>
						<div>
							<input
								className="type-box input"
								type="password"
								placeholder="Password"
								name="password"
								onChange={handleChange}
								autoComplete="new-password"
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
			}
		</div>
  );
}
