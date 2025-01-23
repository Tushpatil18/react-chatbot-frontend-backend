import React, { useState, useEffect } from 'react';
import axios from 'axios';
const marked = require('marked');

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // Fetch previous messages from the backend
    axios.get('http://localhost:5001/api/messages')  // Update port to 5001
      .then(response => {
        console.log(response)
        console.log(response.data)
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }, []);

  useEffect(() => {
    document.getElementById( 'message-window' ).scrollTo({ left: 0, top: document.getElementById( 'message-window' ).scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
        try {
            const response = await axios.post('http://localhost:5001/api/messages', {
                userMessage: userInput,
            });

            // Ensure bot's response is added correctly
            setMessages([...messages, { userMessage: userInput, botReply: response.data.botReply }]);
            setUserInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
};


  const handleInputVal = async (e) => {
    if(e.key === 'Enter'){
      handleSendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox} id='message-window'>
        <div style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div key={index} style={styles.message}>
              <div style={styles.userMessage}>{message.userMessage}</div>
              <div style={styles.botReply} dangerouslySetInnerHTML={{__html: message.botReply}}></div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyUp={handleInputVal}
          style={styles.input}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
  },
  chatBox: {
    padding: '20px',
    flex: 1,
    overflowY: 'scroll',
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    marginBottom: '10px',
  },
  userMessage: {
    backgroundColor: '#d1f7d1',
    padding: '10px',
    borderRadius: '10px',
    alignSelf: 'flex-start',
  },
  botReply: {
    backgroundColor: '#e0e0e0',
    padding: '10px',
    borderRadius: '10px',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  input: {
    width: '80%',
    padding: '10px',
    borderRadius: '5px',
  },
  sendButton: {
    width: '15%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
};

export default Chatbot;
