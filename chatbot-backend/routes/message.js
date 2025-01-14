// routes/message.js
const express = require('express');
const Message = require('../models/Message');  // Import Message model
const axios = require('axios');
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
    const message = new Message({ userMessage, botReply });
    await message.save();

    res.json({ userMessage, botReply });
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Error saving message' });
  }
});

// Route to get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });  // Get all messages sorted by timestamp
    res.status(200).json(messages);  // Respond with the messages
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving messages' });
  }
});


let userName = 'Guest';

// Generate a random response based on message type
function generateResponse(message) {
  const lowerCaseMessage = message.toLowerCase();

  // Greetings
  if (lowerCaseMessage === "hello" || lowerCaseMessage === "hi") {
    return `Hello, ${userName}! How can I assist you today?`;
  }

  // Farewell
  if (lowerCaseMessage.includes("bye")) {
    return `Goodbye, ${userName}! Take care!`;
  }

  // Ask for name
  if (lowerCaseMessage.includes("my name is")) {
    const name = message.split("is")[1].trim();
    userName = name;
    return `Nice to meet you, ${name}!`;
  }

  // Jokes
  if (lowerCaseMessage.includes("tell me a joke")) {
    return getJoke();
  }

  // Weather (Example using an external API, make sure to get your own API key from a weather service)
  if (lowerCaseMessage.includes("weather in")) {
    const location = message.split("in")[1].trim();
    return getWeather(location);
  }

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


async function askChatGPT(question) {
  const apiKey = '0fffdf5239bbe894c317e58062349278'; // Replace with your OpenAI API key

  const defaultModel = 'gpt-3.5-turbo';

  // Uncomment the model you want to use, and comment out the others
  // const model = 'gpt-4';
  // const model = 'gpt-4-32k';
  // const model = 'gpt-3.5-turbo-0125';
  const model = defaultModel;

  // Build the URL to call
  const apiUrl = `http://195.179.229.119/gpt/api.php?${qs.stringify({
    prompt: question,
    api_key: apiKey,
    model: model
  })}`;

  try {
    const response = await axios.get(apiUrl);
    // Print the response data
    console.log(marked.marked(response.data.content));
    return marked.marked(response.data.content);    
  } catch (error) {
    console.log(error);
    return 'Sorry, I couldn’t process your request.';
  }
}


module.exports = router;
