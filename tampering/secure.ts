import express, { Request, Response } from "express";
import session, { SessionData } from "express-session";

const app = express();

// Enter session secret key as an argument
const secret: string = process.argv[2];

app.use(express.urlencoded({ extended: false }));

// Extend the SessionData interface to include custom session properties
declare module 'express-session' {
  interface SessionData {
    user?: string;
    sensitive?: string;
  }
}

app.use(
  session({
    secret: `${secret}`,
    cookie: {
        httpOnly: true,
        sameSite: 'strict', // Updated for stricter security
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.post("/sensitive", (req: Request, res: Response) => {
  if (req.session.user === 'Admin') {
    req.session.sensitive = 'supersecret';
    res.send({ message: 'Operation successful' });
  } else {
    res.send({ message: 'Unauthorized Access' });
  }
});

app.get("/", (req: Request, res: Response) => {
  let name = "Guest";

  if (req.session.user) name = req.session.user;

  res.send(`
  <h1>Welcome, ${name}</h1>
  <form action="/register" method="POST">
    <input type="text" name="name" placeholder="Your name">
    <button>Submit</button>
  </form>
  <form action="/forget" method="POST">
    <button>Logout</button>
  </form>
  `);
});

app.post("/register", (req: Request, res: Response) => {
  const sanitizedName = escapeHTML(req.body.name.trim());
  req.session.user = sanitizedName;
  res.send(`<p>Thank you</p> <a href="/">Back home</a>`);
});

app.post("/forget", (req: Request, res: Response) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

/**
 * sanitize input to prevent XSS attacks
 * @param input 
 * @returns input with HTML special characters escaped
 */
function escapeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

