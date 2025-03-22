import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    Table,
    Space,
    Button,
    Tag,
    Tooltip,
    Popconfirm,
    Typography,
    Statistic,
    message
} from 'antd';
import {
    DeleteOutlined,
    BookOutlined,
    TeamOutlined,
    EditOutlined,
    UndoOutlined,
    PlusOutlined,
    DeleteFilled
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { DeleteSoftCourse, DestroyCourse, GetCourseListByTeacherId, restoreCourse } from '../../ultill/courseApi';
import { AuthContext } from '../context/auth.context';

const { Title, Text } = Typography;

const CourseManagerPageTeacher = () => {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);

    const { auth, setAuth } = useContext(AuthContext);


    // Mock data simulation
    useEffect(() => {
        fetchListCourse();
    }, []);

    const fetchListCourse = async () => {
        const res = await GetCourseListByTeacherId(auth?.user?.id);
        setCourses(res);
    }


    const handleDelete = async (course_id) => {
        const res = await DeleteSoftCourse(course_id);
        if (res && res?.modifiedCount > 0) {
            message.success('Khóa học đã được đưa vào thùng rác.');
            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course._id === course_id ? { ...course, deleted: true } : course
                )
            );
        }
    };

    const handleDestroy = async (course_id) => {
        const res = await DestroyCourse(course_id);
        if (res && res?.deletedCount > 0) {
            message.success('Khóa học đã bị xóa.');
            setCourses(prevCourses => prevCourses.filter(course => course._id !== course_id));
        }
    };

    const handleActivate = async (course_id) => {
        const res = await restoreCourse(course_id);
        if (res && res?.modifiedCount > 0) {
            message.success('Đã kích hoạt lại khóa học!');
            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course._id === course_id ? { ...course, deleted: false } : course
                )
            );
        }
    };

    const showCourseDetails = (course) => {
        setCurrentCourse(course);
    };


    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            key: 'title',
            render: (text, record) => (
                <a onClick={() => showCourseDetails(record)}>{text}</a>
            ),
        },
        {
            title: 'Số bài học',
            dataIndex: 'lessons',
            key: 'duration',
            render: (lessons) => lessons.length
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (record) => {
                return (
                    <span>
                        {record !== 0 ? (
                            <Text strong>{record.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
                        ) : (
                            <Text type="success">Miễn phí</Text>
                        )}
                    </span>
                );
            }
        },
        {
            title: 'Học viên',
            dataIndex: 'students',
            key: 'students',
            render: (students) => students.length
        },
        {
            title: 'Trạng thái',
            dataIndex: 'deleted',
            key: 'deleted',
            render: deleted => (
                <Tag color={deleted !== true ? 'green' : 'red'}>
                    {deleted !== true ? 'Hoạt động' : 'Đã xóa'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    {record.deleted !== true && (
                        <>
                            <Tooltip title="Chỉnh sửa">
                                <Link to={`/course-edit/${record._id}`}>
                                    <Button size="small">
                                        <EditOutlined />
                                    </Button>
                                </Link>
                            </Tooltip>
                            <Tooltip title="Xóa khóa học">
                                <Popconfirm
                                    title="Xóa khóa học?"
                                    description="Chuyển khóa học vào thùng rác!"
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    onConfirm={() => handleDelete(record._id)}
                                >
                                    <Button danger size="small">
                                        <DeleteOutlined />
                                    </Button>
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                    {record.deleted === true && (
                        <>
                            <Tooltip title="Khôi phục">
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => handleActivate(record._id)}
                                >
                                    <UndoOutlined />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Xóa vĩnh viễn">
                                <Popconfirm
                                    title="Xóa vĩnh viễn khóa học?"
                                    description="Xóa vĩnh viễn sẽ không thể khôi phục lại khóa học!"
                                    okText="Xóa vĩnh viễn"
                                    cancelText="Hủy"
                                    onConfirm={() => handleDestroy(record._id)}
                                >
                                    <Button danger size="small">
                                        <DeleteFilled />
                                    </Button>
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{
                padding: 24,
                background: '#fff',
                borderRadius: 4,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={4}>Quản lý khóa học</Title>
                    <Link to={"/course-create"}>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Thêm khóa học
                        </Button>
                    </Link>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Statistic title="Tổng số khóa học" value={courses.length} prefix={<BookOutlined />} />
                            <Statistic
                                title="Khóa học đang hoạt động"
                                value={courses.filter(course => !course.deleted).length}
                                valueStyle={{ color: '#3f8600' }}
                            />
                            <Statistic
                                title="Tổng học viên đăng ký"
                                value={courses.reduce((sum, course) => sum + course.students.length, 0)}
                                prefix={<TeamOutlined />}
                            />
                        </div>
                    </Card>
                </div>

                <Table
                    columns={columns}
                    dataSource={courses}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
};

export default CourseManagerPageTeacher;
