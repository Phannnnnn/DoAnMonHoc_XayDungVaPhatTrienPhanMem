const express = require('express');
const route = express.Router();

const registerController = require('../controllers/RegisterApiController');

route.post('/register', registerController.createUser);

module.exports = route;