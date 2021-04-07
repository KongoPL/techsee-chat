import React, {useState} from 'react';
import SocketIOChatDriver from "./SocketIOChatDriver";
import MessageForm from "./MessageForm";
import Message from "./Message";

import './App.css';

class App extends React.Component
{
    /**
     * @type {SocketIOChatDriver}
     */
    api;
    chatBottomElement;

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
        this.api = new SocketIOChatDriver("http://127.0.0.1:1112");

        this.api.onMessage.subscribe((message) => {
            this.setState(state => ({
                ...state,
                messages: [...state.messages, message]
            }));
        });

        this.api.onMessagesHistory.subscribe(messages => this.setState({ messages }))

       this.api.onError.subscribe((errorCode, message) => {
           alert(`${message} (#${errorCode})`);
       });
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        this.chatBottomElement.scrollIntoView({ behavior: "smooth" });
    }

    componentWillUnmount()
    {
        this.api.destroy();
    }


    render()
    {
        return (
            <div className="app">
                <div className="messages-list">
                    {this.state.messages.map(m => <Message key={m.createdAt} {...m} />)}
                    <div className="chat-bottom" ref={element => { this.chatBottomElement = element; }} />
                </div>
                <div className="send-form">
                    <MessageForm onMessageSend={this.sendMessage.bind(this)}/>
                </div>
            </div>
        );
    }

    sendMessage(message)
    {
        if(message.replace(/^[\s]+$/, '') === '')
            return;

        this.api.sendMessage(message);
    }
}

export default App;
