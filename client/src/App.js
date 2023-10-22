// Filename: App.js
/* This is the main component of the client application as defined in index.js. 
In this case it also contains the code to connect to the socket.io server. */

import  { useState, useEffect } from 'react';
import io from 'socket.io-client';

// create a new socket.io client instance and attempt to connect to the host server
const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState([]);  // array of chat messages
  const [currentMessage, setCurrentMessage] = useState(''); // current message being typed by the user
  
  useEffect(() => {
    // listen for chat message events emitted by the server
    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    // cleanup function to disconnect from socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // empty array as second argument tells React to only run this effect once, not after every re-render

  const handleSendMessage = () => {
    // emit chat message event to the server
    socket.emit('chat message', currentMessage);
    // clear the input after sending the message
    setCurrentMessage('');
  }

// defining what the App component should render
  return (
    <div className="App">
      <h1>Let's Chat!</h1>
      <div className="messages">
        {messages.map((msg, index) => <div key={index}>{msg}</div>)}  {/* render each message as a div */}
      </div>
      <div className="inputArea">
        <input 
          type="text" 
          value={currentMessage} 
          onChange={(e) => setCurrentMessage(e.target.value)} 
          placeholder='Type your message...'
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

// this export makes the App component available to other modules in the application
export default App;
