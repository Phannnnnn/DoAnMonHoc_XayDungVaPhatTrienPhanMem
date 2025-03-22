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

const deleteCourseService = async (id) => {
    try {
        let result = await Course.delete({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const destroyCourseService = async (id) => {
    try {
        let result = await Course.deleteOne({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
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

const restoreCourseService = async (id) => {
    try {
        let result = await Course.restore({ _id: id })
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

const getCourseListByTeacherIdService = async (teacher_id) => {
    try {
        let result = await Course.findWithDeleted({ teacher_id: teacher_id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseListDeleteService = async () => {
    try {
        let result = await Course.findDeleted({ deletedAt: { $ne: null } })
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
    getCourseListService,
    getCourseListDeleteService,
    restoreCourseService,
    getCourseListByTeacherIdService
}
