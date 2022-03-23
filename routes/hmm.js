const userController = require('../controller/userController');
const {verifyToken,
      verifyAdmin} = require('../controller/midController');

const express = require('express');
const router = express.Router();

//GET ALL USERS
router.get('/', verifyToken, userController.getAllUser);

//DELETE USERS
router.delete('/:id', verifyAdmin, userController.deleteUser);

module.exports = router;