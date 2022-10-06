if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
var bodyParser = require("body-parser")
app.set('view-machine', 'ejs')
app.use(express.urlencoded( {extended: false}))

app.use(bodyParser.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const users =[]
const { authenticate } = require('passport')

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )

app.get('/', (req,res)=> {
    res.render('index.ejs')
})


app.get('/login',(req,res) => {
    res.render('login.ejs')
})

app.get('/private',(req,res) => {
    res.render('private.ejs')
})


app.post('/login', passport.authenticate('local', {
    successRedirect:'/private',
    failureRedirect: '/login',
    failureFlash: true

}))

app.get('/register',(req,res) => {
    res.render('registrazione.ejs');
})


app.post('/register', async (req,res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.nome,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch { 
        res.redirect('/register')

    }
    console.log(users)
})
app.listen(3000)