# practice-chat-app
A simple chat app.  Built as an exercise to become more familiar with React, Express and Socket.io.
Extensive comments are included to help introduce others to these technologies.

## Steps to create the app
### Setting up the Server
Install Node, Express and Socket.io
```
mkdir chat-app && cd chat-app
mkdir server && cd server
npm init -y 
npm install express socket.io
touch app.js
```

#### Starter server code
```Javascript
const express = require('express');
// import Node's native HTTP server module
const http = require('http');
const socketIO = require('socket.io');

// initialize a new instance of Express
const app = express();

// create a new HTTP server instance for Socket.io to piggyback on
const server = http.createServer(app);

// initialize a new instance of socket.io by passing the HTTP server object
const io = socketIO(server);

// listen for incoming connections from clients
io.on('connection', (socket) => {
  console.log('user connected');

  // listen for socket to disconnect
  socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

// start the HTTP server and listen on port 3000
// when the server starts listening, the callback function is executed
server.listen(3000, () => {
console.log('listening on *:3000');
});
```

### Setting up the React Client
```bash
npx create-react-app client
cd client
npm install socket.io-client
```
#### Starter Client code
```Javascript
import { useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  useEffect(() => {
  const socket = io('http://localhost:3000');

  // cleanup function to disconnect from socket when component unmounts
  return () => {
    socket.disconnect();
  };
}, []); // empty array as second argument tells React to only run this effect once, not after every re-render

// defining what the App component should render
return (
  <div className="App">
    <h1>Let's Chat!</h1>
  </div>
  );
}

// this export makes the App component available to other modules in the application
export default App;
```


### Integrating Chat Functionality
#### Handling chat messages on the server
Handle custom 'chat message' events with Socket.io:
```Javascript
// listen for incoming connections from clients
io.on('connection', (socket) => {
  console.log('user connected');
  
  // handling chat messages
  // listen for chat message events from clients
  socket.on('chat message', (msg) => {
    // broadcast the message to all other clients
    socket.broadcast.emit('chat message', msg);
  });
  
  // listen for socket to disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
```

#### Send and receive chat messages on the client
Add State within the App component:
- import `useState` from react
- store all previous messages in an array `messages` and the current typed message as a string `currentMessage`
```Javascript
const [messages, setMessages] = useState([]);
const [currentMessage, setCurrentMessage] = useState('');
```
Add event handlers to listen for incoming messages and send messages
```Javascript
useEffect(() => {
    const socket = io('http://localhost:3000');
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
  // ...
}  
```

#### Creating the UI
Provide an input for typing messages, a button for sending, and display the messages:
```Javascript
function App() {
  // ...

  return (
    <div className="App">
      <h1>Let's Chat!</h1>
      <div className="messages">
        {messages.map((msg, index) => <div key={index}>{msg}</div>)}
      </div>
      <div className="inputArea">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

```
Some notes on the above additions:

- The `useState` hook initializes the state and provides a function (`setMessages` and `setCurrentMessage`) to modify it.
- The chat messages are displayed using a  `.map()` function which iterates over each message and renders it as a separate div.
- An input element is used to type messages. Its value is bound to the `currentMessage` state.
- The `onChange` handler for the input updates the state as the user types.
- A button is used to send the message. On click, it triggers the `handleSendMessage` function, which emits the message to the server and clears the input.
