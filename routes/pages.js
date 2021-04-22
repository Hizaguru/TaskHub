const express = require('express');

const router = express.Router();
//Shows index.hbs page
router.get('/',(req, res) => {
    res.render('index');
});
//shows register.hbs form.
router.get('/register',(req, res) => {
    res.render('register');
});

module.exports = router;