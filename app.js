const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './.env'})

const app = express();

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');

database.connect( (err) => {
    if(err){
        console.log(err)
    } else{
        console.log("Connected to the database")
    }
})

app.get("/", (req, res) => {
    //res.send("<h1>Home Page</h1>")
    res.render("index");
});

app.listen(5000, () =>{
    console.log("Server started on Port 5000");
})