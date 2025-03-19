import React, { useEffect, useState } from "react";
import { Empty, Typography, Button, Dropdown, Divider } from 'antd';
import { GetCourseList } from "../../ultill/courseApi";
import { Link } from "react-router-dom";
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DeleteFilled } from '@ant-design/icons';
import '../../styles/course.css'

const Courses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const getCourseList = async () => {
            try {
                const res = await GetCourseList();
                if (res && Array.isArray(res)) {
                    setCourses(res);
                } else {
                    setCourses([]);
                }
            } catch (error) {
            }
        }
        getCourseList();
    }, [])

    const getItems = (course) => [
        {
            key: '1',
            label: 'Sửa khóa học',
            icon: <EditOutlined />,
            onClick: () => handleEdit(course)
        },
        {
            key: '2',
            label: 'Xóa khóa học',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(course)
        },
    ];

    const handleEdit = (course) => {
        console.log('Edit course:', course);
    };

    const handleDelete = (course) => {
        console.log('Delete course:', course);
    };

    const handleAddCourse = () => {
    };

    const handleViewTrash = () => {
        console.log('View trash');
    };

    return (
        <>
            <div className="courses-header">
                <h1 className="title">Danh sách khóa học</h1>
                <div className="buttons-container">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddCourse}
                    >
                        <Link to={"/manager/create"}>Thêm khóa học</Link>
                    </Button>
                    <Button
                        type="text"
                        icon={<DeleteFilled />}
                        onClick={handleViewTrash}
                        className="trash-btn"
                    >
                        Thùng rác
                    </Button>
                </div>
            </div>
            <Divider style={{ margin: '0 0 16px 0' }} />
            <div className="course-container">
                {courses.length === 0 ? (
                    <div className="empty-container">
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            description={<>Bạn chưa đăng khóa học nào. <Link > Đăng khóa học.</Link></>}
                        />
                    </div>
                )
                    :
                    (
                        courses.map((course) => (
                            <div className="course-card" key={course._id}>
                                <div className="course-actions">
                                    <Dropdown
                                        menu={{ items: getItems(course) }}
                                        placement="bottomRight"
                                        trigger={['click']}
                                    >
                                        <Button type="text" icon={<MoreOutlined />} />
                                    </Dropdown>
                                </div>
                                <img src={course.course_img || ""} alt={course.name} />
                                <div className="course-info">
                                    <h3>{course.name || "Không có tiêu đề"}</h3>
                                    <span className="price">{course?.price !== 0 ? course?.price : "Miễn phí"}</span>
                                </div>
                            </div>
                        ))
                    )}
            </div >
        </>
    );
};

export default Courses;
