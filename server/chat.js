const EventEmitter = require('events');

class Chat {
	/**
	 * @type {Participant[]}
	 */
	#participants = [];

	/**
	 * @type {Message[]}
	 */
	#messages = [];

	getMessages()
	{
		return this.#messages;
	}
	
	
	join()
	{
		const participant = new Participant();

		this.#participants.push(participant);

		return participant;
	}

	
	writeMessage(participant, message)
	{
		if(this.participantExists(participant))
		{
			const message = new Message(participant, message);

			this.#messages.push(message);

			return message;
		}

		return false;
	}
	
	

	leave(participantId)
	{
		const participantIndex = this.#participants.findIndex(p => p.id === participantId);

		if(participantIndex === -1)
			return false;

		this.#participants.splice(participantIndex, 1);

		return true;
	}

	
	participantExists(participant)
	{
		return this.#participants.includes(participant);
	}
}

class Participant {
	id = '';
	name = '';
	
	
	constructor(id = '', name = '')
	{
		if(id === '')
			id = this.#generateId();
		
		if(name === '')
			name = this.#generateName();
		
		this.id = id;
		this.name = name;
	}

	
	// @todo Make sure it's always unique
	#generateId(length = 6)
	{
		const chars = 'abcdef0123456789';
		let id = '';
		
		while(id.length < length)
			id += chars[this.#randomNumber(0, chars.length - 1)];
		
		return id;
	}
	
	
	#generateName()
	{
		const adjectives = ['Super', 'Almighty', 'Mysterious', 'Funny'],
			names = ['John', 'Cara', 'Alice', 'Bill', 'Peter', 'Anna'];
		
		const adjective = adjectives[this.#randomNumber(0, adjectives.length - 1)],
			name = names[this.#randomNumber(0, names.length - 1)];
		
		return `${adjective} ${name}`;
	}
	
	
	#randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}


	toObject() {
		return {
			id: this.id,
			name: this.name
		};
	}
}

class Message {
	/**
	 * @type {Participant}
	 */
	participant;
	message;
	createdAt;

	
	constructor(participant, message)
	{
		this.participant = participant;
		this.message = message;
		this.createdAt = (new Date()).getTime();
	}

	
	toExternalObject()
	{
		return {
			participant: this.participant.name,
			message: this.message,
			createdAt: this.createdAt
		};
	}
}

module.exports = Chat;
