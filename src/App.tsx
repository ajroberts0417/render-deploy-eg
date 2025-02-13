import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io, Socket } from 'socket.io-client';


// Connect to the socket server
const socketClient = io(`http://localhost:${import.meta.env.VITE_PORT || 3000}`);

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {

    socketClient.on('connect', () => {
      console.log('Connected to server');
    });

    socketClient.on('message', (msg: string) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketClient.off('connect');
      socketClient.off('message');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && socketClient) {
      socketClient.emit('message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App
