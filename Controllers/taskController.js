import Task from "../Models/taskModel.js";
// import User from "../Models/userModel.js";
// import EmailServiceProvider from "../Services/emailServiceProvider.js";
// import { emailSuccessMessages } from "../Services/responseMessages.js";
import { Status } from "../constants.js";
import { AwsCloud } from "../Services/cloudService.js";
import { getFileName } from "../Services/service.utils.js";
import { generateS3ObjectURL } from "../Services/service.utils.js";

export const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const getAllTask = async (req, res) => {
    try {
        const task = await Task.find()
            .populate({ path: "collaborators", select: { email: 1, name: 1 } })
            .populate("assignee", "name");
        if (!task) {
            return res.status(404).json();
        }

        res.status(200).json({
            ...task,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("subtasks");
        const bucketName = process.env.AWS_TASK_ATTACHMENT_S3_BUCKET;
        if (!task) {
            return res.status(404).json();
        }

        if (task.fileAttachments.length) {
            task.fileAttachments.map((attachment) => {
                const paramGetObject = {
                    Bucket: bucketName,
                    Key: attachment,
                };
                const url = generateS3ObjectURL(bucketName, attachment);
                console.log(url);
                AwsCloud.s3.getObject(paramGetObject, function (err, data) {
                    if (err) return err;

                    // let objectData = data.Body.toString("utf-8"); // Convert Body from a Buffer to a String
                    res.status(200).json({
                        task,
                        objectUrl: new URL(url),
                    });
                });
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

export const addSubtask = async (req, res) => {
    try {
        const parentTask = await Task.findById(req.params.taskId);
        const subtask = new Task(req.body);
        await subtask.save();
        parentTask.subtasks.push(subtask._id);
        await parentTask.save();
        res.status(201).json({ parentTask, subtask });
    } catch (error) {
        res.status(400).json(error);
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Update fields that are allowed to be updated
        const updates = Object.keys(req.body);
        updates.forEach((update) => (task[update] = req.body[update]));

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const addAttachments = async (req, res) => {
    try {
        const bucketName = process.env.AWS_TASK_ATTACHMENT_S3_BUCKET;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                status: Status.FAIL,
                message: "Task not found",
            });
        }

        if (!req.files) {
            return res.status(400).json({
                status: Status.FAIL,
                message: "No file to upload",
            });
        }

        const fileNames = req.files.map((file) => {
            const paramPutObject = {
                Bucket: bucketName,
                Key: getFileName(file.originalname),
                Body: file.buffer,
            };
            AwsCloud.s3.upload(paramPutObject, (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        status: Status.FAIL,
                        message: "Error uploading file.",
                    });
                }
                console.log("File uploaded to S3");
            });
            return paramPutObject.Key;
        });

        task.fileAttachments.push(...fileNames);
        await task.save();
        res.status(200).json({
            status: Status.SUCCESS,
            message: "Files have been successfully attached to task",
        });
    } catch (error) {
        res.status(400).json(error);
    }
};

export const removeSubtask = async (req, res) => {
    try {
        const parentTask = await Task.findById(req.params.taskId);
        const subtaskId = req.params.subtaskId;
        parentTask.subtasks = parentTask.subtasks.filter(
            (id) => !id.equals(subtaskId),
        );
        await parentTask.save();
        await Task.findByIdAndRemove(subtaskId);
        res.status(200).json(parentTask);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({
            message: "Task deleted successfully",
            task: task,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

// export const addCollaborator = async (req, res, next) => {
//     try {
//         const task = await Task.findById(req.params.taskId).populate(
//             "collaborators",
//         );
//         const collaborator = await User.findById(req.body.userId);
//         if (!task || !collaborator) {
//             return res.status(404).json({ error: "Task or User not found" });
//         }
//         if (
//             task.collaborators.some((user) => user._id.equals(collaborator._id))
//         ) {
//             return res
//                 .status(400)
//                 .json({ error: "User is already a collaborator" });
//         }
//         task.collaborators.push(collaborator._id);
//         await task.save();

//         // Send email to the collaborator
//         const emailService = EmailServiceProvider.emailServiceInstance;
//         const emailTemplate = emailService.generateCollaboratorAddedTemplate({
//             toName: collaborator.name,
//             toTaskTitle: task.title,
//             from: process.env.SENDER_EMAIL,
//             to: collaborator.email,
//             cc: getEmailIdsFromTask(task, collaborator),
//         });

//         emailService.sendEmail(
//             emailTemplate,
//             task.title,
//             emailSuccessMessages.ADD_COLLABORATOR,
//             res,
//         );
//     } catch (error) {
//         res.status(400).json(error);
//     }
// };

// export const removeCollaborator = async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.taskId);
//         const collaboratorId = req.body.userId;
//         const collaborator = await User.findById(collaboratorId);
//         if (!task || !collaborator) {
//             return res.status(404).json({ error: "Task or User is not found" });
//         }
//         task.collaborators = task.collaborators.filter(
//             (id) => !id.equals(collaboratorId),
//         );
//         await task.save();

//         // Send email to the collaborator
//         const emailService = EmailServiceProvider.emailServiceInstance;
//         const emailTemplate = emailService.generateCollaboratorRemovedTemplate({
//             toName: collaborator.name,
//             toTaskTitle: task.title,
//             from: process.env.SENDER_EMAIL,
//             to: collaborator.email,
//             cc: getEmailIdsFromTask(task, collaborator),
//         });

//         emailService.sendEmail(
//             emailTemplate,
//             task.title,
//             emailSuccessMessages.REMOVE_COLLABORATOR,
//             res,
//         );
//     } catch (error) {
//         res.status(400).json(error);
//     }
// };

function getEmailIdsFromTask(task, collaborator) {
    const taskList = task.collaborators
        .filter(
            (taskCollaborator) => collaborator.email !== taskCollaborator.email,
        )
        .map((taskCollaborator) => {
            if (taskCollaborator) {
                return taskCollaborator.email;
            }
        });
    return taskList;
}
