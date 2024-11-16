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
* Published URL: https://web-04-flax.vercel.app/
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
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/about', (req, res)=>{
    res.render('about')
})

app.get('/lego/sets', (req, res)=>{
    
    legoData.getSetsByTheme(req.query.theme || "").then((value)=>{
        console.log(value);
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


app.get('/lego/addSet',(req,res)=>{
    legoData.getAllThemes()
    .then((themeData) => {
      res.render('addSet', { themes: themeData });  // Render the view with the themes
    })
    .catch((error) => {
        res.status(404).render('404',  {message: "error "});     });
})

app.post('/lego/addSet',(req, res)=>{

    const setData = req.body;  // Get the data from the request body
  
    legoData.addSet(setData)  // Call the addSet function which returns a promise
      .then(() => {
        // If successful, redirect to /lego/sets
        res.redirect('/lego/sets');
      })
      .catch((err) => {
        // If there's an error, render the 500 view with an error message
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
    
})

app.get('/lego/editSet/:num',  (req, res)=>{
    setNum = req.params.num;
    Promise.all([legoData.getSetByNum(setNum), legoData.getAllThemes()])
    .then(([setData, themeData]) => {
      if (!setData) {
        // If no set is found, render 404 with a message
        res.status(404).render('404', { message: `Set with number ${setNum} not found` });
      } else {
        // Render the edit view with themes and set data
        res.render('editSet', { themes: themeData, set: setData });
      }
    })
    .catch((err) => {
      // Handle any errors by rendering the 404 view
      res.status(404).render('404', { message: err.message});
    });
})

app.post('/lego/editSet', (req, res)=>{
    let set_num = req.body.set_num;
    let setData = req.body;
   
    legoData.editSet(set_num, setData)
    .then((value)=>{
        res.redirect('/lego/sets')
    })
    .catch((err)=>{
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    })
})

app.get('/lego/deleteSet/:num', (req, res)=>{
    let set_num = req.params.num;
    legoData.DeleteSet(set_num)
    .then(()=>{
        res.redirect('/lego/sets')
    })
    .catch(()=>{
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    })

})


app.use((req, res, next) => {
    res.status(404).render('404',  {message: "No view matched for a specific route "}); 
    // for the assignment
  });

app.listen(3000)
