const express = require("express");
const userRouter = require("./users/userRouter.js");
const server = express();
const postRouter = require("./posts/postRouter");

server.use(express.json());
server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const time = new Date.now();
  console.log(req, res, time);
  next();
}

module.exports = server;
