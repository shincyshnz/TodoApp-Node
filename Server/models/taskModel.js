const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    task: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: [300, "Task cannot be more than 300 Characters"],
        required: [true, "Task cannot be empty."]
    },
    isCompleted: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);