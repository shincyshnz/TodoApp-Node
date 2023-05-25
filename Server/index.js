const { v4: uuidv4 } = require('uuid');
const express = require("express");
const app = express();
const cors = require("cors");
const taskList = require("./taskList.json");

app.use(cors());
app.use(express.json());

app.get("/api/task", (req, res) => {
    res.status(200).json(taskList);
});

app.post("/api/task", (req, res) => {
    const { task } = req.body;

    if (!("task" in req.body)) {
        res.status(400).json({
            message: `${JSON.stringify(req.body)}:This attribute is not accepted, Required attribute is : task`,
        });
        return;
    }

    // Create id and set isCompleted
    const id = uuidv4();
    const taskItem = {
        id: id,
        task: task,
        isCompleted: false,
    };

    // Push taskItem to taskList
    taskList.push(taskItem);
    res.status(201).json(taskList);

});

app.put("/api/task", (req, res) => {
    const { id, task, isCompleted } = req.body;

    const originalKeys = Object.keys(taskList[0]);
    const reqKeys = Object.keys(req.body);

    if (!(JSON.stringify(originalKeys) === JSON.stringify(reqKeys))) {
        const missingKeys = reqKeys.filter((element, index) => {
            return (originalKeys[index] !== element) ? reqKeys[index] : "";
        });

        return res.status(400).json({
            message: `${JSON.stringify([...missingKeys])
                }: These attributes are not accepted, Required attributes are: ${originalKeys}`
        });

    };


    const isExists = taskList.find((taskItem) => taskItem.id === id);

    if (!isExists) {
        return res.status(404).json({
            message: `Item with id : ${id} does not exists`,
        });
    }

    taskList.forEach((taskItem) => {
        if (taskItem.id === id) {
            taskItem.task = task;
            taskItem.isCompleted = isCompleted || false;
        }
    });
    res.status(202).json(taskList);
});

app.delete("/api/task", (req, res) => {
    const { id } = req.body;

    const taskIndex = taskList.findIndex((taskItem) => taskItem.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: `Item with id : ${id} does not exists`,
        });
    }

    taskList.splice(taskIndex, 1);
    res.status(203).json(taskList);
});

app.all("*", (req, res) => {
    res.status(404).json("This page does not exists")
});

const PORT = 3010;
app.listen(PORT, () => { console.log(`Server started at ${PORT} `) });