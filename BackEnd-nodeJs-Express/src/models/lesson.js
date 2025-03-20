const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }, // Tiêu đề bài giảng
    content: { type: String }, // Nội dung bài giảng (hoặc link video)
    videoUrl: { type: String, default: '' }, // Link video (nếu có)
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true }, // Thuộc khóa học nào
    order: { type: Number, required: true }, // Số thứ tự trong khóa học
}, { timestamps: true });

lessonSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Lesson = mongoose.model('lesson', lessonSchema);

module.exports = Lesson;