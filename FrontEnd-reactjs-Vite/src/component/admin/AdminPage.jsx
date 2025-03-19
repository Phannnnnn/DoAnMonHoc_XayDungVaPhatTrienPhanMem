import React, { useContext, useState } from 'react';
import { Menu, Input, Button, Avatar, Dropdown, Typography } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';
const { Text } = Typography;

const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const AdminPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [user, setUser] = useState({
        name: auth?.userLogin?.name ?? "",
        avatar: '',
    });

    const handleLogout = () => {
        setAuth({
            isAuthenticated: false,
            user: null

        });
        setUser({});
        localStorage.clear("token");
        navigate("/");
    };

    const userMenu = [
        {
            key: "header",
            label: (
                <div style={{ padding: "10px 15px", textAlign: "center" }}>
                    <Avatar size={64} src={user?.avatar} icon={!user?.avatar && <UserOutlined />} />
                    <div style={{ marginTop: 8 }}>
                        <Text strong>{auth?.user?.name || "Xin chào"}</Text>
                    </div>
                </div>
            ),
            disabled: true, // Không cho click vào
        },
        { key: "divider1", type: "divider" },
        ...(auth?.user?.role === "admin" ? [
            {
                key: 'coursesmanager',
                icon: <SettingOutlined />,
                label: <Link to="/coursesmanager">Quản lý khóa học</Link>,
            },
        ]
            :
            [
                {
                    key: 'coursesmanager',
                    icon: <SettingOutlined />,
                    label: <Link to="/coursesmanager">Khóa học đã đăng ký</Link>,
                },
            ]),
        { key: "divider2", type: "divider" },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
    ];

    const menuItems = [
        ...(auth?.user?.role === "admin" ? [
            { label: <Link to="/manager">Trang quản trị</Link>, key: '/manager' },
            { label: <Link to="/manager/course">Danh sách khóa học</Link>, key: '/manager/course' },
            { label: <Link to="/manager/user">Người dùng</Link>, key: '/manager/user' },
            { label: <Link to="">what-ever</Link>, key: 'e' },
        ]
            : [])
    ];

    return (
        <>
            <header style={styles.header}>
                <div style={styles.logo}>
                    <Link to={"/"} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <BookOutlined style={{ fontSize: 32 }} />
                        <span style={{ marginLeft: 8, fontWeight: 'bold', fontSize: 24 }}>EduOnline</span>
                    </Link>

                </div>

                <Menu
                    mode="horizontal"
                    items={menuItems}
                    selectedKeys={[location.pathname]}
                    style={styles.menu}
                />

                <div style={{ marginRight: 48 }}>
                    <Search
                        placeholder="Tìm kiếm"
                        onSearch={onSearch}
                        enterButton
                        className="admin-search"
                    />
                </div>
                <div style={styles.actions}>
                    <div>
                        {auth.isAuthenticated ? (
                            <Dropdown menu={{ items: userMenu }} trigger={"click"} placement="bottomRight" arrow>
                                <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                    <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} />
                                </div>
                            </Dropdown>
                        ) : (<>
                            <Link to="/login" style={styles.link}>
                                <Button type="text">Đăng nhập</Button>
                            </Link>
                            <Link to="/register" style={styles.link}>
                                <Button type="primary">Đăng ký</Button>
                            </Link>
                        </>
                        )}
                    </div>
                </div>
            </header>
            <Outlet />
        </>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 50px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fff',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
    },
    menu: {
        flex: 1,
        justifyContent: 'center',
        borderBottom: 'none',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    username: {
        fontWeight: '500',
    },
    link: {
        marginLeft: '8px',
    },
};

export default AdminPage;
