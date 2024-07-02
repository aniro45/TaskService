import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectToMongoDataBase } from './dbconfig.js';
import Initializer from './serviceInitializer.js';


connectToMongoDataBase();
new Initializer();

const port = process.env.PORT || 5550; 
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});