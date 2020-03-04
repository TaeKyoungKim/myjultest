const dot = require('dotenv');
const express = require('express')
const mysql = require('mysql')
const login = require('../utils/login')
const register =require('../utils/register')
const router = express.Router()
dot.config();

var db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
})


// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});


// route to handle user registration
router.post('/register', register);
router.post('/login', login)

module.exports = router