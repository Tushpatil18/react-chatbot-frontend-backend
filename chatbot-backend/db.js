const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = './database/myDatabase.db';

// Ensure the database folder exists
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database', { recursive: true });
}

// Create the database connection
const db = new sqlite3.Database(path, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the "messages" table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userMessage TEXT NOT NULL,
            botReply TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Messages table is ready');
        }
    });
});

// Export the database connection to be used in other files
module.exports = db;
