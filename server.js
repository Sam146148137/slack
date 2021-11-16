require('dotenv').config();
const express = require('express');
const app =  express();

const connectToDb = require('./util/connectDb');
const authController = require('./modules/endpoints');

connectToDb().catch((err)=>{
    console.log("Error connecting to mongo.", err);
});

app.use(express.json());
app.use('/', authController);


const port = process.env.PORT;
app.listen(port,() => {
    console.log(`Server started on port ${port}`);
});