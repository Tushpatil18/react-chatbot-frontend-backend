// routes/message.js
const express = require('express');
const Message = require('../models/Message');  // Import Message model
const axios = require('axios');

const db = require('./../db');  // Import the SQLite database connection

const readlineSync = require('readline-sync');
const qs = require('querystring');
const marked = require('marked');

const router = express.Router();

// Route to send a new message
router.post('/', async (req, res) => {
  try {
    const { userMessage } = req.body;  // Get user and message from request body

    // Here, you can add a simple bot logic or integrate with AI API
    const botReply = await generateResponse(userMessage);
    //const botReply = `Bot received: ${userMessage}`;  // Placeholder logic

    // Save the conversation to DB
    // const message = new Message({ userMessage, botReply });
    // await message.save();

  
    const query = `INSERT INTO messages (userMessage, botReply) VALUES (?, ?)`;

    db.run(query, [userMessage, botReply], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Send back the response including the generated bot reply
        res.json({ userMessage, botReply });
    });


  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Error saving message' });
  }
});


// Route to get all messages
router.get('/', async (req, res) => {
  try {
      const query = `SELECT * FROM messages ORDER BY timestamp asc`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
  
    // const messages = await Message.find().sort({ timestamp: 1 });  // Get all messages sorted by timestamp
    // res.status(200).json(messages);  // Respond with the messages
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving messages' });
  }
});


let userName = 'Guest';

// Generate a random response based on message type
function generateResponse(message) {
  const lowerCaseMessage = message.toLowerCase();
 console.log(lowerCaseMessage)
  // Greetings
  if (lowerCaseMessage === "hello" || lowerCaseMessage === "hi") {
    return `Hello, ${userName}! How can I assist you today?`;
  }
  console.log(1)
  // Farewell
  if (lowerCaseMessage.includes("bye")) {
    return `Goodbye, ${userName}! Take care!`;
  }
  console.log(2)
  // Ask for name
  if (lowerCaseMessage.includes("my name is")) {
    const name = message.split("is")[1].trim();
    userName = name;
    return `Nice to meet you, ${name}!`;
  }
  console.log(3)
  // Jokes
  if (lowerCaseMessage.includes("tell me a joke")) {
    return getJoke();
  }

  // Weather (Example using an external API, make sure to get your own API key from a weather service)
  if (lowerCaseMessage.includes("weather in")) {
    const location = message.split("in")[1].trim();
    return getWeather(location);
  }
  console.log(4)
  // Default fallback
  //return "Sorry, I didn't understand that. Can you ask something else?";
  return askChatGPT(message);
}

// Fetch a random joke from an API
async function getJoke() {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    return `${response.data.setup} - ${response.data.punchline}`;
  } catch (error) {
    return "Sorry, I couldn't fetch a joke right now.";
  }
}

// Fetch weather data from an API (Example using OpenWeatherMap API)
async function getWeather(location) {
  const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your OpenWeatherMap API Key
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await axios.get(url);
    const weather = response.data;
    const temp = weather.main.temp;
    const weatherDescription = weather.weather[0].description;
    return `The current weather in ${location} is ${temp}°C with ${weatherDescription}.`;
  } catch (error) {
    return `Sorry, I couldn't fetch the weather for ${location}. Please check the spelling or try again later.`;
  }
}

//you need to generate your api key from this website https://rapidapi.com/Creativesdev/api/free-chatgpt-api/playground/apiendpoint_1c4321d5-2b0d-4ff4-a673-5b2838029196

async function askChatGPT(question) {
  console.log(question)
  const options = {
    method: 'GET',
    url: 'https://free-chatgpt-api.p.rapidapi.com/chat-completion-one',
    params: {prompt: question},
    headers: {
      'x-rapidapi-key': 'Enter Your Chatgpt Api key here',
      'x-rapidapi-host': 'free-chatgpt-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    // Print the response data
    console.log(response.data);
    let res = response.data.response.replaceAll('###', '<br>');
    return marked.marked(res).replaceAll('<code>', '<br><code>').replaceAll('</code>', '</code><br>');    
  } catch (error) {
    console.log(error);
    return 'Sorry, I couldn’t process your request.';
  }
}


module.exports = router;
