import mongoose from "mongoose";

export function connectToMongoDataBase() {
    const DB_STRING = process.env.DB_CONNECTION_STRING;
    const DB = DB_STRING.replace(
        "<DB_USERNAME>",
        process.env.DB_USERNAME,
    ).replace("<DB_PASSWORD>", process.env.DB_PASSWORD);

    mongoose.connect(DB);

    mongoose.connection.on("connected", () => {
        console.log("The Online database has connected");
    });
}
