/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Vanshaj Gugnani Student ID: vgugnani@myseneca.ca Date: 4-Nov-2024
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
app.set('view engine', 'ejs');
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/about', (req, res)=>{
    res.render('about')
})

app.get('/lego/sets', (req, res)=>{
    
    legoData.getSetsByTheme(req.query.theme || "").then((value)=>{
        res.render('sets', {legoSets: value})
        // console.log(value)
    })
    .catch((err)=>{
        res.status(404).render('404', {message: "No Sets found for a matching theme"})
    })
})

app.get('/lego/sets/:num', (req, res)=>{

    legoData.getSetByNum(req.params.num).then((value)=>{
        res.render("set", {set: value})
    })
    .catch((err)=>{
        res.status(404).render('404', {message: "No Sets found for a specific set num"})
    })
})



app.use((req, res, next) => {
    res.status(404).render('404',  {message: "No view matched for a specific route "});
  });

app.listen(3000)
