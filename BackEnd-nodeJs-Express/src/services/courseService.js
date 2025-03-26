const Course = require("../models/course");
const Lesson = require("../models/lesson");

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

const createCourseLessonService = async (title, content, video_id, course_id, order) => {
    try {
        // Kiểm tra khóa học có tồn tại không
        const course = await Course.findById(course_id);
        if (!course) {
            return ({ message: "Khóa học không tồn tại" });
        }
        // Tạo bài học mới
        const newLesson = new Lesson({
            title,
            content,
            video_id,
            course_id,
            order,
        });

        newLesson.lesson_img = `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCvhOydCVOREo2vIDNsS1lXKWwQgA`;
        // Lưu bài học vào database
        await newLesson.save();
        // Cập nhật danh sách bài học trong khóa học
        course.lessons.push(newLesson._id);
        await course.save();

        return ({ lesson: newLesson, EC: 0 });
    } catch (error) {
        return null;
    }
}

const updateCourseService = async (course_id, data) => {
    try {
        let result = await Course.updateOne({ _id: course_id }, data)
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
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

const getCourseLessonListService = async (course_id) => {
    try {
        let result = await Lesson.find({ course_id: course_id })
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
    getCourseListByTeacherIdService,
    createCourseLessonService,
    getCourseLessonListService
}
