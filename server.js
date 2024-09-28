const express = require('express')
const app = express();
const legoData = require("./modules/legoSets");
legoData.initialize();
// console.log(legoData.getAllSets())
// console.log(typeof(legoData.getAllSets()))
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

app.get('/lego/sets/num-demp', (req, res)=>{
    
    legoData.getSetByNum('10072-1').then((value)=>{
        res.send(value)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.get('/lego/sets/theme-demp', (req, res) => {
    legoData.getSetsByTheme('tech').then((value)=>{
        res.send(value)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.listen(3000)
