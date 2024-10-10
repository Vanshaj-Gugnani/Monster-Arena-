/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Vanshaj Gugnani Student ID: vgugnani@myseneca.ca Date: 10-oct-2024
*
* Published URL: 
*
********************************************************************************/



const express = require('express')
const app = express();
const legoData = require("./modules/legoSets");
const path = require('path')
legoData.initialize();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'./views/home.html'))
})

app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname,'./views/about.html'))
})

app.get('/lego/sets', (req, res)=>{
    
    legoData.getSetsByTheme(req.query.theme || "").then((value)=>{
        res.send(value)
    })
    .catch((err)=>{
        res.sendFile(path.join(__dirname,'./views/404.html'))
    })
})

app.get('/lego/sets/:num', (req, res)=>{

    legoData.getSetByNum(req.params.num).then((value)=>{
        res.send(value)
    })
    .catch((err)=>{
        res.sendFile(path.join(__dirname,'./views/404.html'))
    })
})



app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, './views/404.html'));
  });

app.listen(3000)
