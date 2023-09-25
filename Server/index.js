const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const connectDb = require("./config/db");
const taskRoute = require("./routes/taskRoutes");

const app = express();

var corsOptions = {
    origin: "https://todo-app-node-sigma.vercel.app",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(express.json());
app.use(cors(corsOptions));

connectDb();

app.use("/api/task", taskRoute);


app.all("*", (req, res) => {
    res.status(404).json("This page does not exists")
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => { console.log(`Server started at ${PORT} `) });