const express=require('express');
require('dotenv').config();
const app=express();
const mysql=require('mysql2');
const port=process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get('/',(req,res)=>{
    res.send('Hello World!');
});
const connection=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});
connection.connect();

try{
    connection.query("SHOW TABLES",(err,result)=>{
        if(err) throw err;
        console.log(result);
    });}
    catch(err){
        console.error('Error executing query:', err);
    }


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
});