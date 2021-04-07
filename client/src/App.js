import socketIOClient from 'socket.io-client';
import React, {useState} from 'react';
import './App.css';

class App extends React.Component {
    socket;

    constructor()
    {
        super();

        this.state = {
            participantData: null,
            messages: [],
        };
    }

    componentDidMount()
    {
        this.socket = socketIOClient("http://127.0.0.1:1112");

        this.socket.on('set-participant-data', (participant) => this.setState({participant}));

        this.socket.on('message', (message) => {
            this.setState(state => ({
                ...state,
                messages: [...state.messages, message]
            }));
        });

        this.socket.on('error', (data) => {
            const errorsList = {
                1: 'Internal server error occurred'
            };

            alert(errorsList[data.errorCode]);
        });

        this.socket.on('messages-history', (messages) => this.setState({messages}))
        this.socket.on('participant-joins', () => {})
        this.socket.on('participant-leaves', () => {})
    }


    render()
    {
        return (
            <div className="app">
                <div className="messages-list">
                    {this.state.messages.map(m => <Message key={m.createdAt} {...m} />)}
                </div>
                <div className="message-form">
                    <MessageForm onMessageSend={this.sendMessage.bind(this)} />
                </div>
            </div>
        );
    }

    sendMessage(message)
    {
        this.socket.emit('message', message);
    }
}

function Message({participant, message})
{
    return <div className="message">
        <b>{participant.name}:</b><br/>
        {message}
    </div>
}

function MessageForm({onMessageSend})
{
    const [message, setMessage] = useState('');

    return <form onSubmit={sendMessage}>
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

export default App;
