const Course = require("../models/course");
const Lesson = require("../models/lesson");
const User = require("../models/user");

const createCourseService = async (name, description, price, course_img, teacher_id) => {
    try {
        const teacher = await User.findOne({ _id: teacher_id });
        if (!teacher) {
            return ({ message: "Giảng viên không hợp lệ!" });
        }

        const result = await Course.create({
            name: name,
            description: description,
            price: price,
            course_img: course_img,
            teacher_id: teacher_id
        })

        teacher.createdCourses.push(result._id);
        await teacher.save();

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateCourseService = async (course_id, data) => {
    try {
        const result = await Course.updateOne({ _id: course_id }, data)
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const deleteCourseService = async (id) => {
    try {
        const result = await Course.delete({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const destroyCourseService = async (id) => {
    try {
        //Xoa cac bai hoc lien quan
        await Lesson.deleteMany({ course_id: id });

        //Xoa bai hoc user da dang ky

        const result = await Course.deleteOne({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseService = async (id) => {
    try {
        const result = await Course.findById({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const restoreCourseService = async (id) => {
    try {
        const result = await Course.restore({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}


const getCourseListService = async () => {
    try {
        const result = await Course.find({})
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseListByTeacherIdService = async (teacher_id) => {
    try {
        const result = await Course.findWithDeleted({ teacher_id: teacher_id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseListDeleteService = async () => {
    try {
        const result = await Course.findDeleted({ deletedAt: { $ne: null } })
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
    getCourseListByTeacherIdService,
}
