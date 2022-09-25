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

const formQuestionsList = {
	bugfix: [
		{
			name: 'should-do',
			text: 'What should it do?'
		}, {
			name: 'does-do',
			text: 'What did it do instead?'
		}, {
			name: 'make-happen',
			text: 'How did you get it to happen?'
		}
	],
	feature: [
		{
			name: 'what-is-feature',
			text: 'What is the feature?'
		}, {
			name: 'why-feature',
			text: 'Why do you want it?'
		}
	],
	functionality: [
		{
			name: 'what-is-functionality',
			text: 'What should be improved?'
		}, {
			name: 'how',
			text: 'How could it be improved?'
		}, {
			name: 'why-functionality',
			text: 'Why do you want it?'
		}
	],
	comment: [
		{
			name: 'comment',
			text: 'Leave us a comment!'
		}
	]
};

const generalQuestions = [
	{
		name: 'extra',
		text: 'Add any extra information:'
	}, {
		name: 'screenshots',
		text: 'Attach any helpful screenshots:'
	}, {
		name: 'email',
		text: 'What is your email? (Can be anonymous)'
	}
];

const questionToForm = (questions, oldData) => 
	questions.reduce((form, question) => {
		form[question.name] = form[question.name] || '';
		return form;
	}, oldData || {});

const Feedback = () => {
	
  const [show, setShow] = useState(false);
	const [formState, setFormState] = useState([
		{ feedbackType: '' }
	]);
	const [images, setImages] = useState([]);
	
	const formQuestions = formQuestionsList[formState[0].feedbackType];

	const openModal = () => {
		setShow(true);
	}
	
	const handleFormChange = event => {
		// console.log(event.target.name, event.target.value);
		const {name, value} = event.target
		if (name === 'feedback-type') {
			const formData = [...formState];
			formData[0].feedbackType = value;
			formData[1] = questionToForm(formQuestionsList[value], formData[1]);
			formData[1] = questionToForm(generalQuestions, formData[1]);
			setFormState(formData);
		} else {
			const formData = [...formState];
			formData[1][name] = value;
			setFormState(formData);
		}
	}
	
	const handleImageChange = event => {
		setImages([...event.target.files]);
	}
	
	const handleFormSubmit = event => {
		event.preventDefault();
		// do something
		console.log(formState);
		setFormState([
			{ feedbackType: '' }
		]);
		setShow(false);
	}
	
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
		<form onSubmit={handleFormSubmit}>
			<Modal title='Feedback' onClose={() => setShow(false)}>
				<div className='feedback'>

					<label className='label'>What would you like to do?</label>

					<div className='field'>
						<div className='control'>
							{feedbackType.map(item => (
								<label className='radio' key={item.value}>
									<input 
										type='radio' 
										name='feedback-type' 
										value={item.value}
										onChange={handleFormChange}
									/>
									{item.text}
								</label>
							))}
						</div>
					</div>

					{formState[0].feedbackType && formQuestions.map(item => (
						<div className='field' key={item.name}>
							<label className='label'>
								{item.text}
							</label>
							<div className='control'>
								<textarea 
									name={item.name} 
									value={formState[1][item.name]}
									rows={3}
									onChange={handleFormChange}
								/>
							</div>
						</div>
					))}
					
					{formState[0].feedbackType && (
						<>
							<div className='field'>
								<label className='label'>
									{generalQuestions[0].text}
								</label>
								<div className='control'>
									<textarea
										name={generalQuestions[0].name}
										value={formState[1][generalQuestions[0].name]}
										rows={3}
										onChange={handleFormChange}
									/>
								</div>
							</div>
							<div className='field'>
								<label className='label'>
									{generalQuestions[1].text}
								</label>
								<div className='control'>
									<input
										type='file'
										multiple
										accept='image/*'
										onChange={handleImageChange}
									/>
								</div>
							</div>
							<div className='field'>
								<label className='label'>
									{generalQuestions[2].text}
								</label>
								<div className='control'>
									<input
										className='email'
										type='text'
										name={generalQuestions[2].name}
										value={formState[1][generalQuestions[2].name]}
										onChange={handleFormChange}
										autoComplete='username'
									/>
								</div>
							</div>
						</>
					)}
				</div>
			</Modal>
		</form>
	);
	
};

export default Feedback;