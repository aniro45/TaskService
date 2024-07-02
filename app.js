import express from "express";
import taskRouter from "./Routers/taskRoutes.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log("Hello from Task Service");
    next();
});

app.use("/api/v1/tasks", taskRouter);

export default app;
