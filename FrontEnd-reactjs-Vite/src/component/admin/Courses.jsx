import React, { useEffect, useState } from "react";
import { Empty, Typography, Button, Dropdown, Divider } from 'antd';
import { GetCourseList } from "../../ultill/courseApi";
import { Link } from "react-router-dom";
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DeleteFilled } from '@ant-design/icons';
import '../../styles/course.css'

const Courses = () => {
    const [courses, setCourses] = useState([]);

    //format giá tiền
    const formatPrice = (price) => {
        if (price === 0) return "Miễn phí";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };

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
            key: '3',
            label: 'Xóa khóa học',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(course)
        },
    ];

    const handleDelete = (course) => {
        console.log('Delete course:', course);
    };

    return (
        <>
            <div className="courses-header">
                <h1 className="title">Danh sách khóa học</h1>
                <div className="buttons-container">
                    <Link to={"/manager/create"}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                        >
                            Thêm khóa học
                        </Button>
                    </Link>

                    <Link to={"/manager/trash"}>
                        <Button
                            type="text"
                            icon={<DeleteFilled />}
                            className="trash-btn"
                        >
                            Thùng rác
                        </Button>
                    </Link>
                </div>
            </div>
            <Divider style={{ margin: '0 0 16px 0' }} />
            <div className="course-container">
                {courses.length === 0 ? (
                    <div className="empty-container">
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            description={<>Bạn chưa đăng khóa học nào. <Link to={"/manager/create"}> Đăng khóa học.</Link></>}
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
                                <Link to={`/manager/edit/${course._id}`}><img src={course.course_img || ""} alt={course.name} /></Link>
                                <div className="course-info">
                                    <h3>{course.name || "Không có tiêu đề"}</h3>
                                    <span className="price" style={{ fontSize: '16px', fontWeight: '600' }}>{formatPrice(course?.price)}</span>
                                </div>
                            </div>
                        ))
                    )}
            </div >
        </>
    );
};

export default Courses;
