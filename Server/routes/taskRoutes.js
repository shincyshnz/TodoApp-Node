const express = require("express");
const router = express.Router();
const TaskModel = require("../models/taskModel");
const taskModel = require("../models/taskModel");

async function within(fn, res, duration) {
    const id = setTimeout(() => res.json({
        message: "There was an error with the upstream service!"
    }), duration)

    try {
        let data = await fn()
        clearTimeout(id)
        res.json(data)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function getTaskLists() {
    return (await TaskModel.find().select("task isCompleted"));
}

router.get("/", async (req, res) => {
    await within(getTaskLists, res, 10000)
    // try {
    //     const taskLists = await TaskModel.find().select("task isCompleted");
    //     // .sort({ updatedAt: "desc" })
    //     res.status(200).json(taskLists);
    // } catch (error) {
    //     res.status(400).json({
    //         message: error.message,
    //     });
    // }
});

router.post("/", async (req, res) => {
    try {
        const { task } = req.body;

        // Application level validation
        if (!("task" in req.body)) {
            res.status(400).json({
                message: `${Object.keys(req.body)}: This attribute is not accepted, Required attribute is: task`,
            });
            return;
        }

        const taskItem = {
            task: task,
            isCompleted: false,
        };

        const newTask = await TaskModel.create(taskItem);

        res.status(200).json({
            _id: newTask._id,
            task: newTask.task,
            isCompleted: newTask.isCompleted
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }

});

router.put("/", async (req, res) => {
    try {
        const { _id, task, isCompleted } = req.body;

        // Application level validation
        if (!("task" in req.body) || !("isCompleted" in req.body)) {
            res.status(400).json({
                message: `${Object.keys(req.body)
                    }: This attribute is not accepted, Required attribute is: task and isCompleted`,
            });
            return;
        }

        const taskItem = {
            task,
            isCompleted
        }

        const updatedData = await TaskModel.findByIdAndUpdate(_id, taskItem, {
            new: true
        });

        if (!updatedData) {
            return res.status(404).json({
                message: `Item with id : ${_id} does not exists`,
            });
        }

        res.status(200).json({
            _id: updatedData._id,
            task: updatedData.task,
            isCompleted: updatedData.isCompleted
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.delete("/", async (req, res) => {
    try {
        const { _id } = req.body;
        const deletedData = await taskModel.findByIdAndDelete(_id);

        if (!deletedData) {
            return res.status(404).json({
                message: `Item with id : ${_id} does not exists`,
            });
        }

        res.status(200).json({
            _id: deletedData._id,
            task: deletedData.task,
            isCompleted: deletedData.isCompleted
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

module.exports = router;