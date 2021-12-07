const express = require('express');

const router = express.Router();
//Shows index.hbs page(route from app.js)
router.get('/',(req, res) => {
    res.render('index');
});
//shows register.hbs form.(route from app.js)
router.get('/register',(req, res) => {
    res.render('register');
});
//shows login.hbs form.(route from app.js)
router.get('/login',(req, res) => {
    res.render('login');
});



module.exports = router;