const express = require('express');
var jwt = require('jsonwebtoken');

const route = express.Router();
const auth = require('../midleware/auth');

const courseController = require('../controllers/CourseApiController');
const verifyRole = require('../midleware/verifyRole');

route.all('*', auth, verifyRole);

route.post('/course-create', courseController.createCoure);
route.get('/courselist', courseController.getCourseList);
route.get('/getcourse', courseController.getCourse);

module.exports = route;