import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Typography, Input, Empty, Card, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, UndoOutlined, SearchOutlined } from '@ant-design/icons';
import { DestroyCourse, GetCourseListDelete, restoreCourse } from '../../ultill/courseApi';
import moment from 'moment';

const { Title, Text } = Typography;
const { Search } = Input;

const confirm = (e) => {
    console.log(e);
    message.success('Click on Yes');
};

const TrashCourse = () => {
    // State để lưu trữ danh sách khóa học đã xóa
    const [trashedCourses, setTrashedCourses] = useState([]);
    // State cho loading khi fetch data
    const [loading, setLoading] = useState(true);
    // State cho search
    const [searchText, setSearchText] = useState('');
    // State cho pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchCoursesDelete = async () => {
        const res = await GetCourseListDelete();
        if (Array.isArray(res)) { // Kiểm tra res có phải là mảng không
            const formattedData = res.map(course => ({
                id: course._id,
                title: course.name,
                instructor: course.teacher_id || "Chưa có thông tin",
                deletedAt: course.deletedAt || new Date().toISOString(),
                expiryDays: course.expiryDays || 30,
            }));

            setTrashedCourses(formattedData);
            setPagination(prev => ({
                ...prev,
                total: formattedData.length,
            }));
        } else {
            console.error(res);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoursesDelete();
    }, []);

    // Hàm xử lý khôi phục khóa học
    const handleRestore = (record) => {
        try {
            const res = restoreCourse(record.id);
            if (res) {
                message.success(`Đã khôi phục khóa học: ${record.title}`);
                setTrashedCourses(trashedCourses.filter(course => course.id !== record.id));
            }
        }
        catch (error) {
            message.error(`Khôi phục khóa học không thành công!`);
        }
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa vĩnh viến khóa học này?',
            // icon: React.createElement(ExclamationCircleOutlined),
            content: `Khóa học "${record.name}" sẽ không thể khôi phục!`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                return handleDeletePermanently(record);
            },
        });
    };

    // Hàm xử lý xóa vĩnh viễn
    const handleDeletePermanently = (record) => {
        try {
            const res = DestroyCourse(record.id);
            if (res) {
                message.success(`Đã xóa vĩnh viễn khóa học: ${record.title}`);
                setTrashedCourses(trashedCourses.filter(course => course.id !== record.id));
            }
        }
        catch (error) {
            message.error(`Xóa khóa học không thành công!`);
        }
    };

    // Hàm xử lý search
    const handleSearch = (value) => {
        setSearchText(value);
        setLoading(true);

        setTimeout(() => {
            const filteredData = trashedCourses.filter(
                course => course.title.toLowerCase().includes(value.toLowerCase()) ||
                    course.instructor.toLowerCase().includes(value.toLowerCase())
            );

            setPagination(prev => ({
                ...prev,
                current: 1,
                total: filteredData.length,
            }));

            setLoading(false);
        }, 300);
    };

    // Hàm xử lý thay đổi pagination
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    // Cấu hình các cột trong bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Giảng viên',
            dataIndex: 'instructor',
            key: 'instructor',
        },
        {
            title: 'Ngày xóa',
            dataIndex: 'deletedAt',
            key: 'deletedAt',
            sorter: (a, b) => new Date(a.deletedAt) - new Date(b.deletedAt),
            render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 160,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Khôi phục">
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => handleRestore(record)}
                        ><UndoOutlined /></Button>
                    </Tooltip>
                    <Tooltip title="Xóa vĩnh viễn">
                        <Popconfirm
                            title="Xóa vĩnh viễn khóa học ?"
                            description="Khóa học sẽ không thể khôi phục!"
                            onConfirm={() => handleDeletePermanently(record)}
                            okText="Xóa vĩnh viễn"
                            cancelText="Hủy"
                        >
                            <Button danger><DeleteOutlined /></Button>
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Lọc danh sách khóa học dựa trên search text
    const filteredCourses = searchText
        ? trashedCourses.filter(
            course =>
                course.title.toLowerCase().includes(searchText.toLowerCase()) ||
                course.instructor.toLowerCase().includes(searchText.toLowerCase())
        )
        : trashedCourses;

    return (
        <Card className="trash-course-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3}>Khóa học đã xóa</Title>
                <Search
                    placeholder="Tìm kiếm khóa học..."
                    allowClear
                    enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
                    size="middle"
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredCourses}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                locale={{
                    emptyText: <Empty description="Không có khóa học nào trong thùng rác" />
                }}
                footer={() => (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">
                            Các khóa học sẽ bị xóa vĩnh viễn sau thời hạn được quy định
                        </Text>
                        <Space>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                disabled={filteredCourses.length === 0}
                                onClick={() => {
                                    message.success('Đã xóa vĩnh viễn tất cả khóa học');
                                    setTrashedCourses([]);
                                }}
                            >
                                Xóa tất cả
                            </Button>
                            <Button
                                type="primary"
                                icon={<UndoOutlined />}
                                disabled={filteredCourses.length === 0}
                                onClick={() => {
                                    message.success('Đã khôi phục tất cả khóa học');
                                    setTrashedCourses([]);
                                }}
                            >
                                Khôi phục tất cả
                            </Button>
                        </Space>
                    </div>
                )}
            />
        </Card>
    );
};

export default TrashCourse;