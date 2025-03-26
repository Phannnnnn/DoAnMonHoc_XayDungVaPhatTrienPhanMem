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
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetCourseList } from "../../ultill/courseApi";

const { Title, Text } = Typography;

const AdminHomePage = () => {

    const [statisticsData, setStatisticsData] = useState([]);

    const fectchStatisticsData = async () => {
        const course = await GetCourseList();
        console.log(course);
    }

    useEffect(() => {
        fectchStatisticsData();
    }, [])

    // Sample data for statistics
    // const statisticsData = [
    //     { title: "Tổng Học Viên", value: 2986, icon: <TeamOutlined />, color: "#1890ff" },
    //     { title: "Tổng Khóa Học", value: 42, icon: <BookOutlined />, color: "#52c41a" },
    //     { title: "Bài Giảng", value: 647, icon: <VideoCameraOutlined />, color: "#faad14" },
    // ];



    // Sample recent user data
    const recentUsers = [
        { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", course: "HTML, CSS from Zero to Hero", date: "21/03/2025", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Trần Thị B", email: "tranthib@example.com", course: "JavaScript Fundamentals", date: "20/03/2025", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 3, name: "Lê Văn C", email: "levanc@example.com", course: "React.js for Beginners", date: "19/03/2025", avatar: "https://randomuser.me/api/portraits/men/86.jpg" },
        { id: 4, name: "Phạm Thị D", email: "phamthid@example.com", course: "HTML, CSS from Zero to Hero", date: "18/03/2025", avatar: "https://randomuser.me/api/portraits/women/55.jpg" }
    ];

    // Sample course enrollment data
    const courseEnrollmentData = [
        { id: 1, title: "HTML, CSS from Zero to Hero", students: 1234, progress: 85 },
        { id: 2, title: "JavaScript Fundamentals", students: 987, progress: 70 },
        { id: 3, title: "React.js for Beginners", students: 765, progress: 55 },
        { id: 4, title: "Node.js Basics", students: 432, progress: 45 },
        { id: 5, title: "Advanced React & Redux", students: 321, progress: 30 }
    ];

    // Table columns for recent users
    const userColumns = [
        {
            title: "Học Viên",
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
            title: "Khóa Học",
            dataIndex: "course",
            key: "course",
        },
        {
            title: "Ngày Đăng Ký",
            dataIndex: "date",
            key: "date",
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
                        title="Học Viên Mới Đăng Ký"
                        extra={<Link to="#">Xem tất cả</Link>}
                        style={{ marginBottom: "24px" }}
                    >
                        <Table
                            dataSource={recentUsers}
                            columns={userColumns}
                            pagination={false}
                            rowKey="id"
                        />
                    </Card>
                </Col>

                {/* Course Enrollment */}
                <Col xs={24} lg={8}>
                    <Card
                        title="Tình Trạng Khóa Học"
                        extra={<Link to="#">Chi tiết</Link>}
                    >
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            {courseEnrollmentData.map((course) => (
                                <div key={course.id}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <Text ellipsis style={{ maxWidth: "70%" }} title={course.title}>
                                            {course.title}
                                        </Text>
                                        <Text type="secondary">{course.students} học viên</Text>
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
                        extra={<Button type="link">Xem tất cả</Button>}
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