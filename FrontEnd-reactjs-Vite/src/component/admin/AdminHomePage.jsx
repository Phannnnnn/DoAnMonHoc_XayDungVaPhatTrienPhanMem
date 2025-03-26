import React, { useEffect, useState } from "react";
import {
    Typography,
    Card,
    Statistic,
    Table,
    Button,
    Row,
    Col,
    Space,
    Avatar,
    Divider,
} from "antd";
import {
    BookOutlined,
    TeamOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetCourseList } from "../../ultill/courseApi";
import { GetListUser } from "../../ultill/userApi";
import moment from "moment";

const { Title, Text } = Typography;

const AdminHomePage = () => {

    const [statisticsData, setStatisticsData] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [courseEnrollmentData, setCourseEnrollmentData] = useState([]);

    const fectchStatisticsData = async () => {
        const course = await GetCourseList();
        const user = await GetListUser();

        const userList = user.filter(item => item.role === "user");
        setRecentUsers(userList);
        const roleTeacher = user.filter(item => item.role === "teacher");

        setCourseEnrollmentData(course);
        const students = course.reduce((total, course) => total + course.students.length, 0);
        const courses = course.length;
        const lessons = course.reduce((total, course) => total + course.lessons.length, 0);

        setStatisticsData([
            { title: "Tổng Học Viên", value: students || 0, icon: <TeamOutlined />, color: "#1890ff" },
            { title: "Tổng Khóa Học", value: courses || 0, icon: <BookOutlined />, color: "#52c41a" },
            { title: "Bài Giảng", value: lessons || 0, icon: <VideoCameraOutlined />, color: "#faad14" },
            { title: "Giảng viên", value: roleTeacher?.length || 0, icon: <UserOutlined />, color: "#f15bb5" },
        ]);
    }

    useEffect(() => {
        fectchStatisticsData();
    }, [])

    const userColumns = [
        {
            title: "Người dùng",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar} />
                    <div>
                        <Text strong>{text}</Text>
                        <div>
                            <Text type="secondary">{record.email}</Text>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Ngày tham gia",
            dataIndex: "createdAt",
            key: "date",
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm')
        },
    ];

    return (
        <div className="admin-dashboard-container" style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Page Title */}
            <div style={{ marginBottom: "24px" }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3}>Dashboard</Title>
                        <Text type="secondary">Chào mừng trở lại, Admin</Text>
                    </Col>
                </Row>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                {statisticsData.map((stat, index) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={index}>
                        <Card>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                valueStyle={{ color: stat.color }}
                                prefix={stat.icon}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Divider />

            {/* Recent Users and Course Enrollment */}
            <Row gutter={[24, 24]}>
                {/* Recent Users */}
                <Col xs={24} lg={16}>
                    <Card
                        title="Người Dùng Mới"
                        style={{ marginBottom: "24px" }}
                    >
                        <Table
                            dataSource={recentUsers}
                            columns={userColumns}
                            pagination={false}
                            rowKey={(record) => record._id || record.index}
                        />
                    </Card>
                </Col>

                {/* Course Enrollment */}
                <Col xs={24} lg={8}>
                    <Card
                        title="Tình Trạng Khóa Học"
                    >
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            {courseEnrollmentData.map((course) => (
                                <div key={course._id}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <Text ellipsis style={{ maxWidth: "70%" }} title={course.name}>
                                            {course.name}
                                        </Text>
                                        <Text type="secondary">{course?.students?.length || 0} học viên</Text>
                                    </div>
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity */}
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card
                        title="Hoạt Động Gần Đây"
                    >
                        <Timeline>
                            <Timeline.Item color="green">Nguyễn Văn A đã đăng ký khóa học "HTML, CSS from Zero to Hero". (21/03/2025)</Timeline.Item>
                            <Timeline.Item color="green">Trần Thị B đã đăng ký khóa học "JavaScript Fundamentals". (20/03/2025)</Timeline.Item>
                            <Timeline.Item color="blue">Bạn đã thêm khóa học mới "Advanced React & Redux". (20/03/2025)</Timeline.Item>
                            <Timeline.Item color="red">Phạm Văn X đã báo cáo lỗi về bài giảng #24 trong "React.js for Beginners". (19/03/2025)</Timeline.Item>
                            <Timeline.Item color="gray">Bạn đã cập nhật nội dung bài giảng #17 trong "HTML, CSS from Zero to Hero". (18/03/2025)</Timeline.Item>
                        </Timeline>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Define Timeline component
const Timeline = ({ children }) => <div className="ant-timeline" style={{ padding: "8px 0" }}>{children}</div>;
Timeline.Item = ({ color, children }) => (
    <div className="ant-timeline-item" style={{ margin: "0 0 20px 0", position: "relative", paddingLeft: "20px" }}>
        <div className="ant-timeline-item-tail" style={{ position: "absolute", left: "5px", top: "10px", height: "calc(100% + 10px)", borderLeft: "2px solid #f0f0f0" }}></div>
        <div className="ant-timeline-item-head" style={{ position: "absolute", left: "0", top: "5px", width: "10px", height: "10px", backgroundColor: color, borderRadius: "50%" }}></div>
        <div className="ant-timeline-item-content">{children}</div>
    </div>
);

export default AdminHomePage;