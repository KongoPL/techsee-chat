import React, {useState} from "react";

import './MessageForm.css';

export default function MessageForm({onMessageSend})
{
	const [message, setMessage] = useState('');

	return <form className="app-message-form" onSubmit={sendMessage}>
		<input type="text" className="message" value={message} onChange={handleInputChange} />
		<button type="submit">Send</button>
	</form>;


	function handleInputChange(event)
	{
		setMessage(event.target.value);
	}


	function sendMessage(event)
	{
		onMessageSend(message);
		setMessage('');

		event.preventDefault();
	}
}
