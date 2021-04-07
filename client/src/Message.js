import React from "react";

export default function Message({participant, message})
{
	return <div className="app-message">
		<b>{participant.name}:</b><br/>
		{message}
	</div>
}
