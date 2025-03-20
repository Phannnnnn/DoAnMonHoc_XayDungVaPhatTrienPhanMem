const express = require('express');

const route = express.Router();
const auth = require('../midleware/auth');

const courseController = require('../controllers/CourseApiController');
const verifyRole = require('../midleware/verifyRole');

route.all('*', auth, verifyRole);

route.post('/course-create', courseController.createCoure);
route.get('/courselist', courseController.getCourseList);
route.get('/getcourse/:course_id', courseController.getCourse);
route.delete('/delete-course/:course_id', courseController.deleteCourse);

module.exports = route;
