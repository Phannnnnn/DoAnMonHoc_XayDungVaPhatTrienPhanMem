const Course = require("../models/course");

const createCourseService = async (name, description, price, course_img, teacher_id) => {
    try {
        let result = await Course.create({
            name: name,
            description: description,
            price: price,
            course_img: course_img,
            teacher_id: teacher_id
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateCourseService = () => {

}

const deleteCourseService = () => {

}

const destroyCourseService = () => {

}

const getCourseService = async (id) => {
    try {
        let result = await Course.findById({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseListService = async () => {
    try {
        let result = await Course.find({})
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}



module.exports = {
    createCourseService,
    updateCourseService,
    deleteCourseService,
    destroyCourseService,
    getCourseService,
    getCourseListService
}
