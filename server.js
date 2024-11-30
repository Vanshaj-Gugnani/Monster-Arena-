/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Vanshaj Gugnani Student ID: vgugnani@myseneca.ca Date: 16-Nov-2024
*
* Published URL: https://web-05-one.vercel.app/
*
********************************************************************************/
const clientSessions = require('client-sessions');
const authData = require("./modules/auth-service")

const express = require('express')
const app = express();
const legoData = require("./modules/legoSets");
const path = require('path')

legoData.initialize()
    .then(authData.initialize)
    .then(function () {
        app.listen(3000, function () {
            console.log(`app listening on: 3000`);
        });
    }).catch(function (err) {
        console.log(`unable to start server: ${err}`);
    });

    app.use(
        clientSessions({
          cookieName: 'session', // this is the object name that will be added to 'req'
          secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
          duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
          activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
        })
      );

      app.use((req, res, next) => {
        res.locals.session = req.session;
        next();
        })

        function ensureLogin(req, res, next) {
            if (!req.session.user) {
              res.redirect('/login');
            } else {
              next();
            }
          }

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/lego/sets', (req, res) => {

    legoData.getSetsByTheme(req.query.theme || "").then((value) => {
        console.log(value);
        res.render('sets', { legoSets: value })
        // console.log(value)
    })
        .catch((err) => {
            res.status(404).render('404', { message: "No Sets found for a matching theme" })
        })
})

app.get('/lego/sets/:num', (req, res) => {

    legoData.getSetByNum(req.params.num).then((value) => {
        res.render("set", { set: value })
    })
        .catch((err) => {
            res.status(404).render('404', { message: "No Sets found for a specific set num" })
        })
})


app.get('/lego/addSet', ensureLogin, (req, res) => { //route 1
    legoData.getAllThemes()
        .then((themeData) => {
            res.render('addSet', { themes: themeData });
        })
        .catch((error) => {
            res.status(404).render('404', { message: "error " });
        });
})

app.post('/lego/addSet', ensureLogin, (req, res) => { // route 2

    const setData = req.body;

    legoData.addSet(setData)
        .then(() => {

            res.redirect('/lego/sets');
        })
        .catch((err) => {

            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });

})

app.get('/lego/editSet/:num', ensureLogin, (req, res) => { //route 3
    setNum = req.params.num;
    Promise.all([legoData.getSetByNum(setNum), legoData.getAllThemes()])
        .then(([setData, themeData]) => {
            if (!setData) {
                res.status(404).render('404', { message: `Set with number ${setNum} not found` });
            } else {
                res.render('editSet', { themes: themeData, set: setData });
            }
        })
        .catch((err) => {
            res.status(404).render('404', { message: err.message });
        });
})

app.post('/lego/editSet',ensureLogin, (req, res) => { //route 4
    let set_num = req.body.set_num;
    let setData = req.body;

    legoData.editSet(set_num, setData)
        .then((value) => {
            res.redirect('/lego/sets')
        })
        .catch((err) => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        })
})

app.get('/lego/deleteSet/:num',ensureLogin, (req, res) => { //route 5
    let set_num = req.params.num;
    legoData.DeleteSet(set_num)
        .then(() => {
            res.redirect('/lego/sets')
        })
        .catch(() => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        })

})


// new routes
app.get('/login', (req,res)=>{
    res.render("login");
})

app.get('/register', (req, res) =>{
    res.render("register");
})

app.post('/register', (req, res)=>{
    const userData = req.body;
    authData.registerUser(userData)
    .then(()=>{
        res.render("register", {successMessage: "User created"});
    })
    .catch((err)=>{
        res.render("register", {errorMessage: err, userName: req.body.userName})
    })
})

app.post('/login', (req,res) => {
    req.body.userAgent = req.get('User-Agent');
    userData = req.body;
    authData.checkUser(req.body)
    .then((user) => {
        req.session.user = {
        userName: user.userName,
        email: user.email, // authenticated user's email
        loginHistory: user.loginHistory, // authenticated user's loginHistory
        }
        res.redirect('/lego/sets');
        })
    .catch((err)=>{
        res.render("login", {errorMessage: err, userName: req.body.userName});
    })
})

app.get('/logout', (req, res)=>{
    req.session.reset();
    res.redirect('/');
})

app.get('/userHistory', ensureLogin, (req, res)=>{
    res.render('userHistory')
})

app.use((req, res, next) => {
    res.status(404).render('404', { message: "No view matched for a specific route " });
});


