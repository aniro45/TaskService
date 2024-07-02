import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        dueDate: {
            type: Date,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
        },
        status: {
            type: String,
            enum: ["Open", "In Progress", "Completed"],
            default: "Open",
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        subtasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            },
        ],

        fileAttachments: [
            {
                type: String,
                required: false,
                trim: true,
            },
        ],
    },
    { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
