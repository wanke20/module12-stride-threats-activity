import express, { Request, Response } from "express";
import session from "express-session";

const app = express();
const secret: string = process.argv[2];

/** 
 * Extend the SessionData interface 
 * to include custom session properties.
 * This is an example of module augmentation in TypeScript 
 * to extend the express-session module with custom properties 
 * Read more at https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation 
 * **/
declare module 'express-session' {
  interface SessionData {
    user?: string;
    sensitive?: string;
  }
}

// middleware to parse incoming requests
app.use(express.urlencoded({ extended: false }));

// middleware to create a session with secure configuration
app.use(
  session({
    secret: `${secret}`,
    cookie: {
        httpOnly: true,
        sameSite: true,
    },
    resave: false,
    saveUninitialized: false
  })
)

/**
 * This POST endpoints is used to perform a sensitive operation
 * if the user is an admin.
 * otherwise, it will return an error message with "Unauthorized Access"
 */
app.post("/sensitive", (req: Request, res: Response) => {
  if (req.session.user === 'Admin') {
    req.session.sensitive = 'supersecret';
    res.send({ message: 'Operation successful' });
  } else {
    res.send({ message: 'Unauthorized Access' });
  }
});

/**
 * This GET endpoint is used
 * to set the user session if session is not set
 * it also sends a form to the user to input their name
 */
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

/**
 * This POST endpoint is used to redirect 
 * users after they have submitted their name
 * in the form.
 */
app.post("/register", (req: Request, res: Response) => {
  req.session.user = req.body.name.trim();
  res.send(`<p>Thank you</p> <a href="/">Back home</a>`);
});

/**
 * This POST endpoint is used to destroy an existing session
 */
app.post("/forget", (req: Request, res: Response) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});