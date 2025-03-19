const mongoose = require('mongoose');

const course = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    course_img: { type: String, default: '' },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Liên kết với User
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Liên kết với Lesson
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Học viên đăng ký
}, { timestamps: true });

const Course = mongoose.model('course', course);

module.exports = Course;
