// @todo make base interface for all chat drivers
import socketIOClient from "socket.io-client";
import EventListener from "./EventListener";

export default class SocketIOChatDriver {
	participantData = null;
	messages = [];

	_socket;
	_initializedHistory = false;

	constructor(connectionString)
	{
		this._socket = socketIOClient(connectionString);

		this._socket.on('connect', this._onConnect.bind(this));
		this._socket.on('set-participant-data', this._onSetParticipantData.bind(this));
		this._socket.on('message', this._onMessage.bind(this));
		this._socket.on('error', this._onError.bind(this));
		this._socket.on('messages-history', this._onMessagesHistory.bind(this));
		// this._socket.on('participant-joins', this._onParticipantJoins.bind(this));
		// this._socket.on('participant-leaves', this._onParticipantLeaves.bind(this));

		this.onMessage = new EventListener();
		this.onMessagesHistory = new EventListener();
		this.onError  = new EventListener();
	}


	sendMessage(message)
	{
		this._socket.emit('message', message);
	}


	sendLocalMessage(message)
	{
		const messageEntity = {
			participant: {
				id: '',
				name: 'System'
			},
			message: message,
			createdAt: (new Date()).getTime()
		}

		this._onMessage(messageEntity);
	}


	destroy()
	{
		this._socket.disconnect();
	}


	_onConnect()
	{
		this._socket.emit('join-chat');
		this._socket.emit('messages-history');
	}


	_onSetParticipantData(data)
	{
		this.participantData = data;
	}

	_onMessage(messageData)
	{
		this.messages.push(messageData);
		this.onMessage.emit(this._cloneVariable(messageData));
	}

	_onMessagesHistory(messagesHistory)
	{
		this.messages = messagesHistory;
		this.onMessagesHistory.emit(this._cloneVariable(messagesHistory));
	}

	// _onParticipantJoins(participant)
	// {
	// 	this.sendLocalMessage(`${participant.name} joins the chat...`);
	// }
	//
	// _onParticipantLeaves(participant)
	// {
	// 	this.sendLocalMessage(`${participant.name} leaves the chat...`);
	// }

	_onError(data)
	{
		const errorsList = {
			0: 'Unknown Error',
			1: 'Internal server error occurred'
		};

		const message = data.errorCode in errorsList ? errorsList[data.errorCode] : errorsList[0];

		this.onError.emit(data.errorCode, message);
	}

	_cloneVariable(variable)
	{
		return JSON.parse(JSON.stringify(variable));
	}
}
