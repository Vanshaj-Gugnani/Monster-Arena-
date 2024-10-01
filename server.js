/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Vanshaj Gugnani Student ID: vgugnani@myseneca.ca Date: 30-sep-2024
*
* Published URL: https://webassignment2-ten.vercel.app/
*
********************************************************************************/




const express = require('express')
const app = express();
const legoData = require("./modules/legoSets");
legoData.initialize();


app.get('/', (req, res)=>{
    res.send('Assignment 2: Vanshaj Gugnani - 155445224')
})

app.get('/lego/sets', (req, res)=>{
    
    legoData.getAllSets().then((value)=>{
        res.send(value)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.get('/lego/sets/num-demo', (req, res)=>{
    
    legoData.getSetByNum('10072-1').then((value)=>{
        res.send(value)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.get('/lego/sets/theme-demo', (req, res) => {
    legoData.getSetsByTheme('tech').then((value)=>{
        res.send(value)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.listen(3000)
