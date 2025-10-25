import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Define a TypeScript interface for a User
interface User {
  id: number;
  username: string;
  role: string;
}

// Simulated database of users with different roles
const users: User[] = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'user1', role: 'user' },
  { id: 3, username: 'user2', role: 'user' },
];

// Middleware for parsing URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Route to update user role (VULNERABLE TO PRIVILEGE ESCALATION)
app.post('/update-role', (req: Request, res: Response) => {
  const { userId, newRole } = req.body;

  // Simulated authentication (insecure)
  const user = users.find(u => u.id === Number(userId));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Simulated authorization (insecure)
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Update user role (vulnerable to privilege escalation)
  user.role = newRole;
  res.json({ message: 'User role updated successfully' });
});

// Route to serve the HTML form
app.get('/send-form', (req: Request, res: Response) => {
  // Serve the HTML form located in the 'public' directory
  res.sendFile(__dirname + '/userForm.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
