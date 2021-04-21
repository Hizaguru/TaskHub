const express = require('express');
const authController = require('../controllers/auth')
const router = express.Router();

//for submitting the form.
router.post('/register', authController.signup)
module.exports = router;