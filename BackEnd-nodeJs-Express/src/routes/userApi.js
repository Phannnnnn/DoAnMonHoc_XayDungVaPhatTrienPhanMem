const express = require('express');
var jwt = require('jsonwebtoken');

const route = express.Router();
const auth = require('../midleware/auth');

const userController = require('../controllers/UserApiController');
const verifyRole = require('../midleware/verifyRole');

route.all('*', auth, verifyRole);

route.post('/register', userController.createUser);
route.put('/profile-update', userController.updateUser);
route.post('/login', userController.userLogin);
route.get('/user', userController.getListUser);
route.get('/getaccount', userController.getAccount);
route.get('/getinfor', userController.getInforUser);
route.get('/get-endroll', userController.getEnroll);
route.delete('/delete-soft-user', userController.deleteSoftUser);
route.put('/password-chance', userController.passwordChance);

module.exports = route;