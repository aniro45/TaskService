import multer from "multer";
import { AwsCloud } from "./cloudService.js";
import multerS3 from "multer-s3";
import { getFileName } from "./service.utils.js";

const memoryStorage = multer.memoryStorage();

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, getFileName(file.originalname));
    },
});

// Create a Multer storage engine configured for s3
const s3Storage = multerS3({
    s3: AwsCloud.s3,
    bucket: "task-managmen-attachmets-storage",
    key: function (req, file, cb) {
        cb(null, getFileName(file.originalname));
    },
});

export const multerUpload = multer({
    storage: memoryStorage,
    limits: 3 * 1024 * 1024, //3mb
});
