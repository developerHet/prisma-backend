import express from 'express';
import dotenv from 'dotenv';
import  cookieParser from 'cookie-parser';

const app = express();

const port = process.env.PORT || 5000;

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

// Import Route Files
import auth from "./routes/auth.route";

//Routes Files
app.use("/api/auth",auth);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}.`);
})
