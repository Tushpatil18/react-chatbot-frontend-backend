const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');  // Import the SQLite database connection

const messageRoutes = require('./routes/message');  // Import message routes

const app = express();

// Middleware
app.use(cors());  // Enable CORS (Cross-Origin Resource Sharing)
app.use(bodyParser.json());  // Parse incoming JSON requests

// Use message routes
app.use('/api/messages', messageRoutes);

// Save message route
// app.post('/saveMessage', (req, res) => {
//     const { userMessage } = req.body;

//     // Generate a simple bot response based on userMessage
//     let botResponse = "I didn't understand that."; // Default response
    
//     if (userMessage.toLowerCase().includes("hello")) {
//         botResponse = "Hi there!";
//     } else if (userMessage.toLowerCase().includes("how are you")) {
//         botResponse = "I'm doing great, thanks for asking!";
//     } else if (userMessage.toLowerCase().includes("bye")) {
//         botResponse = "Goodbye! Have a nice day!";
//     }

//     // Insert both userMessage and botResponse into the database
//     const query = `INSERT INTO messages (user_message, bot_response) VALUES (?, ?)`;

//     db.run(query, [userMessage, botResponse], function (err) {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         // Send back the response including the generated bot reply
//         res.json({ message: 'Message saved!', id: this.lastID, botReply: botResponse });
//     });
// });

// // Get messages route
// app.get('/getMessages', (req, res) => {
//     const query = `SELECT * FROM messages ORDER BY timestamp DESC`;

//     db.all(query, [], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(rows);
//     });
// });

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
