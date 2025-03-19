const { createCourseService, getCourseListService, getCourseService } = require("../services/courseService");

const createCoure = async (req, res) => {
    const { name, description, price, course_img, teacher_id } = req.body;
    const data = await createCourseService(name, description, price, course_img, teacher_id);
    res.status(201).json(data);
}

const getCourseList = async (req, res) => {
    const data = await getCourseListService();
    res.status(201).json(data);
}

const getCourse = async (req, res) => {
    const id = req.body.course_id;
    const data = await getCourseService(id);
    res.status(201).json(data);
}

module.exports = {
    createCoure,
    getCourse,
    getCourseList
}
