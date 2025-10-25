import express, { Request, Response } from "express";
const app = express();

//app.use(cookieParser());

// Assume the server is malicious. Doesn't do anything useful. Only changes cookies.
app.get("/malhome", (req: Request, res: Response) => {
  res.send(`<h1> You Won! </h1><script> console.log("Session = " + document.cookie); </script>`)
})


app.listen(8001);
