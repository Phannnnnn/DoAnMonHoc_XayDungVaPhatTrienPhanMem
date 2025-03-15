import React from "react";
import { Card, Col, Row, Typography, Tag } from "antd";
import { UserOutlined, ClockCircleOutlined, ReadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const courses = [
    {
        title: "Responsive Với Grid System",
        description: "@web design",
        users: 46616,
        lessons: 34,
        duration: "6h31p",
        color: "#d63384",
    },
];

const CourseCard = ({ course }) => (
    <Card
        hoverable
        style={{ borderRadius: "12px" }}
        styles={{
            body: { padding: "16px" },
        }}
        cover={
            <div
                style={{
                    background: course.color,
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "18px",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                }}
            >
                <Title level={4} style={{ color: "white" }}>{course.title}</Title>
            </div>
        }
    >
        <Text>{course.description}</Text>
        <Tag color="green" style={{ marginTop: "8px" }}>Miễn phí</Tag>
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between" }}>
            <Text><UserOutlined /> {course.users.toLocaleString()}</Text>
            <Text><ReadOutlined /> {course.lessons}</Text>
            <Text><ClockCircleOutlined /> {course.duration}</Text>
        </div>
    </Card>
);

const CoursesPage = () => (
    <div>
        <div style={{ padding: "24px" }}>
            <Row gutter={[16, 16]}>
                {courses.map((course, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <CourseCard course={course} />
                    </Col>
                ))}
            </Row>
        </div>
    </div>
);

export default CoursesPage;
