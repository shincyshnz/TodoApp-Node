const express = require("express");
const cors = require("cors");
// const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const connectDb = require("./config/db");
const taskRoute = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(cors());

connectDb();

app.use("/api/task", taskRoute);
app.get("/test",(req,res)=>{
    res.json("success");
});


app.all("/*", (req, res) => {
    res.status(404).json("This page does not exists")
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => { console.log(`Server started at ${PORT} `) });