import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

const getCurrentDateTime = () => new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

// Define a TypeScript interface for the message object
interface Message {
    message: string;
    user: string;
}

let messages: Message[] = [];
const logStream = fs.createWriteStream('server.log', { flags: 'a' });

// Middleware for parsing URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Middleware for logging requests
app.use((req: Request, res: Response, next: NextFunction) => {
    const logEntry = `[${getCurrentDateTime()}] ${req.method} ${req.url} - ${req.ip}`;
    logStream.write(logEntry + '\n');
    next();
});

// Route to send a message (requires authentication)
app.post('/send-message', (req: Request, res: Response) => {
    const { message, user } = req.body;

    if (!message || !user) {
        throw new Error('Message and user are required fields.');
    }

    messages.push({ message, user });

    const logEntry = `[${getCurrentDateTime()}] Message sent by ${user}: ${message}`;
    logStream.write(logEntry + '\n');

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
});

// Route to retrieve messages (requires authentication)
app.get('/get-messages', (req: Request, res: Response) => {
    // Implement user authentication mechanism here (e.g., token validation)

    // Simulate user authentication for demonstration purposes
    const isAuthenticated = true; // Placeholder for actual authentication logic

    if (!isAuthenticated) {
        return res.status(401).json({ error: 'Unauthorized access. Please login.' });
    }

    // Log access to messages
    const logEntry = `[${getCurrentDateTime()}] Messages retrieved by ${req.ip}`;
    logStream.write(logEntry + '\n');

    return res.status(200).json(messages);
});

// Route to serve the HTML form
app.get('/send-message-form', (req: Request, res: Response) => {
    // Serve the HTML form located in the 'public' directory
    res.sendFile(path.join(__dirname, 'sendMessage.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const logEntry = `[${getCurrentDateTime()}] Error: ${err.message}`;
    logStream.write(logEntry + '\n');
    res.status(500).send(`Something went wrong: ${err.message}`);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
