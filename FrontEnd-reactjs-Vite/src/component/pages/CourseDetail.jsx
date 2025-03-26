import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Typography, Button, Card, Divider, Tag, message } from 'antd';
import { ClockCircleOutlined, BookOutlined, PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CourseUpdate, GetCourse, GetCourseLessonList } from '../../ultill/courseApi';
import { GetInforUser, UpdateUser } from '../../ultill/userApi';
import { AuthContext } from '../context/auth.context';

const { Title, Paragraph, Text } = Typography;

const CourseDetail = () => {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const [courseDetails, setCourseDetail] = useState(null);
    const navigate = useNavigate();

    const fetchCourse = async () => {
        try {
            const course = await GetCourse(id);
            if (course) {
                const lessons = await GetCourseLessonList(id);
                const teacher = await GetInforUser(course.teacher_id);
                course.teacher_id = teacher.name;
                course.lessons = lessons.length > 0 ? lessons : [];
                setCourseDetail(course);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu khóa học:", error);
        }
    };


    useEffect(() => {
        fetchCourse();
    }, []);

    if (!courseDetails) {
        return <Text>Đang tải...</Text>;
    }

    const onHandleEnroll = async (course_id) => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!auth?.user) {
            message.info("Vui lòng đăng nhập để sử dụng chức năng này.");
            navigate("/login");
            return;
        }
        try {
            // Kiểm tra xem khóa học đã được đăng ký chưa
            const userInfor = await GetInforUser(auth?.user?.id);
            const newListEnroll = userInfor?.enrolledCourses || [];
            if (newListEnroll.includes(course_id)) {
                navigate(`/course-learning/${course_id}`);
                return;
            }
            // Cập nhật thông tin người dùng
            newListEnroll.push(course_id);
            userInfor.enrolledCourses = newListEnroll;
            const userUpdateRes = await UpdateUser(userInfor);

            // Cập nhật danh sách học viên của khóa học
            const course = await GetCourse(course_id);
            const students = course.students || [];
            if (!students.includes(auth.user.id)) {
                students.push(auth.user.id);
                course.students = students;
                const courseUpdateRes = await CourseUpdate(course_id, course);
                if (userUpdateRes?.modifiedCount > 0 && courseUpdateRes.modifiedCount > 0) {
                    message.success("Đăng ký thành công.");
                    navigate(`/course-learning/${course_id}`);
                } else {
                    message.error("Đăng ký không thành công. Vui lòng thử lại.");
                }
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký khóa học:", error);
            message.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={2}>{courseDetails.name}</Title>
                        </Col>
                        <Col>
                            <Button onClick={() => onHandleEnroll(courseDetails._id)} type="primary" size="large">Đăng ký học</Button>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Paragraph>{courseDetails.description}</Paragraph>
                </Col>

                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        {/* Cột hình ảnh khóa học */}
                        <Col xs={24} md={12}>
                            <Card style={{ height: "100%" }}>
                                <img src={courseDetails.course_img || `${import.meta.env.VITE_BACKEND_URL}/uploads/no-img.png`} alt="Course"
                                    style={{ width: "100%", height: "140px", objectFit: "cover" }}
                                />
                            </Card>
                        </Col>

                        {/* Cột thông tin khóa học */}
                        <Col xs={24} md={12}>
                            <Card title="Thông tin khóa học" style={{ height: "100%" }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <BookOutlined style={{ marginRight: 8 }} />
                                        <Text>{courseDetails?.lessons?.length || 0} bài học</Text>
                                    </div>
                                    <div>
                                        <UserOutlined style={{ marginRight: 8 }} />
                                        <Text>Giáo viên {courseDetails?.teacher_id || 'chưa cập nhật'}</Text>
                                    </div>
                                    <div>
                                        <PlayCircleOutlined style={{ marginRight: 8 }} />
                                        <Text>Học viên {courseDetails?.students?.length || 0}</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Card title="Nội dung khóa học">
                        {courseDetails.lessons.length > 0 ? (
                            courseDetails.lessons.map((lesson, index) => (
                                <React.Fragment key={lesson._id}>
                                    <Row justify="space-between" align="middle" style={{ padding: '12px 0' }}>
                                        <Col>
                                            <Text strong>Bài {index + 1}: {lesson.title}</Text>
                                        </Col>
                                    </Row>
                                    {index < courseDetails.lessons.length - 1 && <Divider style={{ margin: 0 }} />}
                                </React.Fragment>
                            ))
                        ) : (
                            <Text>Chưa có bài học nào</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CourseDetail;
