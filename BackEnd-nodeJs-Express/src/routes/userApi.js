const express = require('express');
var jwt = require('jsonwebtoken');

const route = express.Router();
const auth = require('../midleware/auth');

const registerController = require('../controllers/UserApiController');
const verifyRole = require('../midleware/verifyRole');

route.all('*', auth, verifyRole);

route.post('/register', registerController.createUser);
route.post('/login', registerController.userLogin);
route.get('/user', registerController.getListUser);
route.get('/getaccount', registerController.getAccount);
route.get('/getinfor', registerController.getInforUser);

module.exports = route;