const express = require('express');
var jwt = require('jsonwebtoken');

const route = express.Router();
const auth = require('../midleware/auth');

const registerController = require('../controllers/UserApiController');

route.all('*', auth);

route.post('/register', registerController.createUser);
route.post('/login', registerController.userLogin);
route.get('/user', registerController.getListUser);

module.exports = route;