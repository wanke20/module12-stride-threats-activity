import express from 'express';
import type { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 3000;

// Define a TypeScript interface for the message object
interface Message {
    message: string;
    user: string;
}

let messages: Message[] = [];

// Middleware for parsing URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Route to send a message
app.post('/send-message', (req: Request, res: Response) => {
    console.log(req.body);
    const { message, user } = req.body;

    if (!message || !user) {
        return res.status(400).json({ error: 'Message and user are required fields.' });
    }

    messages.push({ message, user });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
});

// Route to retrieve messages (without authentication)
app.get('/get-messages', (req: Request, res: Response) => {
    return res.status(200).json(messages);
});

// Route to serve the HTML form
app.get('/send-message-form', (req: Request, res: Response) => {
    // Serve the HTML form located in the 'public' directory
    res.sendFile(path.join(__dirname, 'sendMessage.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
