// models/Message.js
const mongoose = require('mongoose');

// Define schema for messages
const messageSchema = new mongoose.Schema({
  userMessage: String,
  botReply: String,
  timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
module.exports = mongoose.model('Message', messageSchema);
