import React, { useState } from 'react';
import Modal from "../Modal";

const feedbackType = [
	{
		value: 'bugfix',
		text: 'Bugfix'
	}, {
		value: 'feature',
		text: 'Feature Request'
	}, {
		value: 'functionality',
		text: 'Improved Functionality'
	}, {
		value: 'comment',
		text: 'Comment'
	}
];



const Feedback = () => {
	
  const [show, setShow] = useState(false);
	const [formState, setFormState] = useState([
		{ feedbackType: '' }
	]);

	const openModal = () => {
		setShow(true);
	}
	
	const handleFormChange = event => {
		console.log(event.target.name, event.target.value);
		const {name, value} = event.target
		if (name === 'feedback-type') {
			const formData = [...formState];
			formData[0].feedbackType = value;
		}
	}
	
	console.log(formState);
	
	if (!show) return (
		<div className="field has-text-centered">
			<button
				className="l3tters-btn is-warning p-2"
				onClick={openModal}
			>
				Give Feedback
			</button>
		</div>
	)

return (
		<form>
			<Modal title='Feedback' onClose={() => setShow(false)}>
				<div className='field'>
					<label>What would you like to do?</label>
					{feedbackType.map(item => (
						<div key={item.value}>
							<label>
								<input 
									type='radio' 
									name='feedback-type' 
									value={item.value}
									onChange={handleFormChange}
								/>
								{item.text}
							</label>
						</div>
					))}
				</div>
			</Modal>
		</form>
	);
	
};

export default Feedback;