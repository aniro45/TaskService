import express from "express";
import { multerUpload } from "../Services/fileStorageService.js";

const router = express.Router();

import {
    createTask,
    getAllTask,
    getTaskById,
    updateTask,
    addAttachments,
    deleteTask,
    addSubtask,
    removeSubtask,
    // addCollaborator,
    // removeCollaborator,
} from "../Controllers/taskController.js";

router.post("/", createTask);

router.get("/", getAllTask);

router.get("/:id", getTaskById);

router.patch("/:id", updateTask);

router.patch(
    "/:id/attachments",
    multerUpload.array("fileAttachments", 5),
    addAttachments,
);

router.delete("/:id", deleteTask);

router.post("/:taskId/subtasks", addSubtask);

router.delete("/:taskId/subtasks/:subtaskId", removeSubtask);

// router.post("/:taskId/collaborators", addCollaborator);

// router.delete("/:taskId/collaborators", removeCollaborator);

export default router;
