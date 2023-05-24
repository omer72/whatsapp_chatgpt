import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
const App = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatWindow = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    useEffect(() => {
        // Auto scroll down after state update
        chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
    }, [messages]);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    }

    const sendMessage = () => {
        if (input !== '') {
            setMessages([...messages, {text: input, type: 'sent'}]);
            setInput('');            
            openai.createCompletion({                
                model: `${process.env.REACT_APP_OPEN_AI_MODEL}`,                
                prompt: `${input}`,
                max_tokens: 100,
                temperature: 0.1
            }).then(res => {                
                setMessages([...messages, {text: input, type: 'sent'}, {
                    text: res.data.choices[0].text.split('\n')[0],
                    type: 'received'
                }]);
            });
        }
    }

    return (
        <div className="App">
            <div className="chat-window" ref={chatWindow}>
                {messages.map((message, index) =>
                    <div key={index} className={`message ${message.type}`}>
                        <p>{message.text}</p>
                    </div>
                )}
            </div>
            <div className="input-container" onKeyDown={handleKeyDown}>
                <input type="text" value={input} onChange={handleInputChange} className="chat-input" placeholder="Type a message"/>
                <button onClick={sendMessage}  className="send-button">Send</button>
            </div>
        </div>
    );
}

export default App;
