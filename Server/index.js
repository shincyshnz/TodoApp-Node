const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const connectDb = require("./config/db");
const taskRoute = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDb();

app.use("/api/task", taskRoute);

app.all("*", (req, res) => {
    res.status(404).json("This page does not exists")
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => { console.log(`Server started at http://localhost:${PORT} `) });