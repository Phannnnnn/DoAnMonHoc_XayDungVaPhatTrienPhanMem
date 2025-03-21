import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Space, Card, Input, Select, Tag, Avatar, Typography, Popconfirm, message, Tooltip, Row, Col } from 'antd';
import {
    SearchOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    UndoOutlined,
    UserAddOutlined,
    FilterOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { GetListUser } from '../../ultill/userApi';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const User = () => {
    const { authState } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [showDeleted, setShowDeleted] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [showDeleted]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await GetListUser();
            setUsers(res);
            applyFilters(res);
            setLoading(false);
        } catch (error) {
            message.error('Không thể tải danh sách người dùng');
            setLoading(false);
        }
    };

    const applyFilters = (data) => {
        let result = [...data];

        // Áp dụng filter theo role
        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        // Áp dụng tìm kiếm theo tên hoặc email
        if (searchText) {
            result = result.filter(
                user =>
                    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Áp dụng filter theo trạng thái xóa
        if (!showDeleted) {
            result = result.filter(user => !user.deleted);
        }

        setFilteredUsers(result);
        setPagination(prev => ({
            ...prev,
            total: result.length,
        }));
    };

    useEffect(() => {
        applyFilters(users);
    }, [searchText, roleFilter]);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleRoleFilterChange = (value) => {
        setRoleFilter(value);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const handleDelete = (userId) => {
        const res = '';

        message.success('Đã xóa người dùng thành công');
        const updatedUsers = users.map(user =>
            user._id === userId ? { ...user, deleted: true, deletedAt: new Date().toISOString() } : user
        );
        setUsers(updatedUsers);
        applyFilters(updatedUsers);
    };

    const handleRestore = (userId) => {
        // Gọi API khôi phục người dùng
        message.success('Đã khôi phục người dùng thành công');
        const updatedUsers = users.map(user =>
            user._id === userId ? { ...user, deleted: false, deletedAt: null } : user
        );
        setUsers(updatedUsers);
        applyFilters(updatedUsers);
    };

    const handleEdit = (userId) => {
        // Chuyển hướng đến trang chỉnh sửa người dùng
        message.info(`Chỉnh sửa người dùng có ID: ${userId}`);
    };

    const roleColors = {
        admin: 'red',
        teacher: 'green',
        user: 'blue',
    };

    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={40}
                        src={record.avatar}
                        icon={<UserOutlined />}
                    />
                    <div>
                        <Text strong>{record.name}</Text>
                        <br />
                        <Text type="secondary">{record.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: role => (
                <Tag color={roleColors[role]}>
                    {role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giảng viên' : 'Học viên'}
                </Tag>
            ),
            filters: [
                { text: 'Quản trị viên', value: 'admin' },
                { text: 'Giảng viên', value: 'teacher' },
                { text: 'Học viên', value: 'user' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Số khóa học',
            key: 'courses',
            render: (_, record) => (
                <>
                    {record.role === 'teacher' ? (
                        <Tooltip title="Số khóa học đã tạo">
                            <Text>{record.createdCourses.length}</Text>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Số khóa học đã đăng ký">
                            <Text>{record.enrolledCourses.length}</Text>
                        </Tooltip>
                    )}
                </>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => new Date(date).toLocaleDateString('vi-VN'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                record.deleted ? (
                    <Tag color="red">Đã xóa</Tag>
                ) : (
                    <Tag color="green">Hoạt động</Tag>
                )
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    {!record.deleted ? (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => handleEdit(record._id)}
                                disabled={authState?.user?.role !== 'admin' && record.role === 'admin'}
                            />
                            <Popconfirm
                                title="Bạn có muốn xóa người dùng này?"
                                onConfirm={() => handleDelete(record._id)}
                                okText="Xóa"
                                cancelText="Hủy"
                                disabled={authState?.user?.role !== 'admin' && record.role === 'admin'}
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    disabled={authState?.user?.role !== 'admin' && record.role === 'admin'}
                                />
                            </Popconfirm>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Khôi phục">
                                <Popconfirm
                                    title="Bạn có muốn khôi phục người dùng này?"
                                    onConfirm={() => handleRestore(record._id)}
                                    okText="Khôi phục"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="primary"
                                        icon={<UndoOutlined />}
                                        size="small"
                                    />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Xóa vĩnh viễn">
                                <Popconfirm
                                    title="Bạn có muốn xóa vĩnh viễn người dùng này?"
                                    onConfirm={() => handleRestore(record._id)}
                                    okText="Xóa vĩnh viễn"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        size="small"
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3}>Quản lý người dùng</Title>
                    </Col>
                    <Col>
                        <Space>
                            <Link to={"/manager/user-create"}>
                                <Button
                                    type="primary"
                                    icon={<UserAddOutlined />}
                                >
                                    Thêm người dùng
                                </Button>
                            </Link>
                        </Space>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc email"
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={e => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Lọc theo vai trò"
                            style={{ width: '100%' }}
                            onChange={handleRoleFilterChange}
                            defaultValue="all"
                        >
                            <Option value="all">Tất cả vai trò</Option>
                            <Option value="admin">Quản trị viên</Option>
                            <Option value="teacher">Giảng viên</Option>
                            <Option value="user">Học viên</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Button
                            type={showDeleted ? "primary" : "default"}
                            icon={<FilterOutlined />}
                            onClick={() => setShowDeleted(!showDeleted)}
                        >
                            {showDeleted ? "Hiển thị tất cả" : "Hiển thị đã xóa"}
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchUsers}
                            style={{ marginLeft: 8 }}
                        >
                            Làm mới
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="_id"
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Space>
        </Card>
    );
};

export default User;
