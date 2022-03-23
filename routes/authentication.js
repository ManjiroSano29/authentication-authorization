const authController = require('../controller/authController')
const express = require('express');
const router = express.Router();

//REGISTER
router.post('/register', authController.registerUser);

//LOGIN
router.post('/login', authController.loginUser);

//REFRESH
router.post('/refresh',authController.requestRefreshToken);

module.exports = router;