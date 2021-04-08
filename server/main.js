const socketIOServer = require('socket.io')(1112, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"]
		}
	}),
	Chat = require('./chat');

const chatInstance = new Chat();

socketIOServer.on('connection', (client) => {
	let participant;

	client.on('join-chat', () => {
		participant = chatInstance.join();

		client.emit('set-participant-data', participant.toObject());
		socketIOServer.emit('participant-joins', participant.toObject());
	});

	client.on('message', message => {
		const messageEntity = chatInstance.writeMessage(participant, message);

		if(messageEntity)
			socketIOServer.emit('message', messageEntity.toObject());
		else
			client.emit('error', {errorCode: 1});
	});

	client.on('messages-history', () => {
		const messages = chatInstance.getMessages();

		client.emit('messages-history', messages.map(m => m.toObject()));
	});

	client.on('disconnect', () => {
		chatInstance.leave(participant);
		socketIOServer.emit('participant-leaves', participant.toObject());
	})
});

console.log("Server is running successfully at port 1112!");
