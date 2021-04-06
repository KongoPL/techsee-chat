const socketIOServer = require('socket.io')(1112),
	Chat = require('./chat');

const chatInstance = new Chat();

socketIOServer.on('connection', (client) => {
	const participant = chatInstance.join();

	client.emit('set-user-data', participant.toObject());

	client.on('message', message => {
		const messageEntity = chatInstance.writeMessage(participant, message);

		if(messageEntity)
			client.emit('message', messageEntity.toExternalObject());
		else
			client.emit('error', {errorCode: 1});
	});

	client.on('messages-history', () => {
		const messages = chatInstance.getMessages();

		client.emit('messages-history', messages.map(m => m.toExternalObject()));
	});

	client.on('disconnect', () => {
		chatInstance.leave(participant);
	})
});

console.log("Server is running successfully at port 1112!");
