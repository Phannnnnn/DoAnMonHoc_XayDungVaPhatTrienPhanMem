import React, { useContext, useState } from 'react';
import { Menu, Input, Button, Avatar, Dropdown, Typography, Layout, Space, Divider } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    BookOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    SearchOutlined,
    HomeOutlined,
    ReadOutlined,
    TeamOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';

const { Header: AntHeader } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

const AdminHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    const [user, setUser] = useState({
        name: auth?.user?.name ?? "",
        avatar: auth?.user?.avatar ?? "",
        email: auth?.user?.email ?? "email@example.com",
    });

    const handleMenuClick = () => {
        setOpen(false); // Đóng menu sau khi chọn
    };

    const handleLogout = () => {
        setAuth({
            isAuthenticated: false,
            user: null
        });
        setUser({});
        localStorage.clear("token");
        navigate("/");
    };

    const userMenuContent = (
        <div style={styles.userMenuContainer}>
            <div style={styles.userMenuHeader}>
                <Avatar size={64} src={user?.avatar} icon={!user?.avatar && <UserOutlined />} style={styles.userMenuAvatar} />
                <div style={styles.userMenuInfo}>
                    <div style={styles.userName}>{auth?.user?.name || "Username"}</div>
                    <div style={styles.userEmail}>{user?.email || "example@gmail.com"}</div>
                    <div style={styles.userRole}>
                        {auth?.user?.role === "admin" ? "Quản trị viên" : auth?.user?.role === "teacher" ? "Giảng viên" : "Học viên"}
                    </div>
                </div>
            </div>
            <Divider style={styles.menuDivider} />
            <div style={styles.menuItem} onClick={handleMenuClick}>
                <UserOutlined style={styles.menuItemIcon} />
                <Link to="/profile" style={styles.menuItemLink}>Hồ sơ cá nhân</Link>
            </div>
            <div style={styles.menuItem} onClick={handleMenuClick}>
                <SettingOutlined style={styles.menuItemIcon} />
                <Link to="/settings" style={styles.menuItemLink}>Cài đặt tài khoản</Link>
            </div>
            <Divider style={styles.menuDivider} />
            <div style={styles.menuItem} onClick={() => { handleLogout(); handleMenuClick(); }}>
                <LogoutOutlined style={styles.menuItemIcon} color="#ff4d4f" />
                <span style={styles.logoutText}>Đăng xuất</span>
            </div>
        </div>
    );

    const menuItems = [
        {
            label: (
                <Link to="/manager">
                    <Space key="dasboard">
                        <HomeOutlined /> Trang quản trị
                    </Space>
                </Link>
            ),
            key: '/manager',
        },
        {
            label: (
                <Link to="/manager/course">
                    <Space key="course">
                        <ReadOutlined /> Khoá học
                    </Space>
                </Link>
            ),
            key: '/manager/course',
        },
        {
            label: (
                <Link to="/manager/user">
                    <Space key="user">
                        <UserOutlined />Người dùng
                    </Space>
                </Link>
            ),
            key: '/manager/user',
        },
    ];

    return (
        <>
            <style>
                {`
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item-selected,
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item:hover {
                    color: #1890ff;
                }
                
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item:after,
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item-selected:after,
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item:hover:after {
                    border-bottom: none !important;
                }
            `}
            </style>
            <AntHeader style={styles.header}>
                <div style={styles.container}>
                    {/* Logo */}
                    <div style={styles.logo}>
                        <Link to="/" style={styles.logoLink}>
                            <BookOutlined style={styles.logoIcon} />
                            <Title level={3} style={styles.logoText}>EduOnline</Title>
                        </Link>
                    </div>

                    {/* Navigation Menu - Đặt ở giữa */}
                    <div style={styles.menuContainer}>
                        <Menu
                            mode="horizontal"
                            items={menuItems}
                            selectedKeys={[location.pathname]}
                            style={styles.menu}
                            theme="light"
                            className="custom-menu"
                        />
                    </div>

                    {/* Search and User Actions */}
                    <div style={styles.actionsContainer}>
                        <div style={styles.userContainer}>
                            {auth.isAuthenticated ? (
                                <Dropdown
                                    dropdownRender={() => userMenuContent}
                                    trigger={["click"]}
                                    placement="bottomRight"
                                    arrow
                                >
                                    <div style={styles.userAvatar}>
                                        <Avatar
                                            size="default"
                                            src={user?.avatar ?? 'https://i.pinimg.com/474x/f3/b6/2b/f3b62bb38f63d5ac42707c3cbdb73203.jpg'}
                                            icon={!user?.avatar && <UserOutlined />}
                                            style={styles.avatar}
                                        />
                                    </div>
                                </Dropdown>
                            ) : (<></>)}
                        </div>
                    </div>
                </div>
            </AntHeader>
        </>
    );
};

const styles = {
    header: {
        padding: 0,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: 'auto',
        lineHeight: 'normal',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        height: '64px',
    },
    logo: {
        flexShrink: 0,
        marginRight: '24px',
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    logoIcon: {
        fontSize: 28,
        color: '#1890ff',
        marginRight: 8,
    },
    logoText: {
        margin: 0,
        color: '#1890ff',
    },
    menuContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    menu: {
        borderBottom: 'none',
        backgroundColor: 'transparent',
        fontSize: 15,
        justifyContent: 'center',
        flex: 1,
        minWidth: 0
    },
    actionsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginLeft: '24px',
    },
    search: {
        width: 180,
    },
    userContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    userAvatar: {
        cursor: 'pointer',
    },
    avatar: {
        background: '#1890ff',
        cursor: 'pointer',
    },
    // Styles cho menu người dùng
    userMenuContainer: {
        width: 280,
        background: 'white',
        borderRadius: 4,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        padding: '8px 0',
    },
    userMenuHeader: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    userMenuAvatar: {
        marginBottom: 8,
        background: '#ccc',
    },
    userMenuInfo: {
        width: '100%',
        textAlign: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    userRole: {
        fontSize: 12,
        color: '#fff',
        background: '#f56a00',
        borderRadius: 12,
        padding: '2px 12px',
        display: 'inline-block',
    },
    menuDivider: {
        margin: '4px 0',
    },
    menuItem: {
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background 0.3s',
        '&:hover': {
            background: '#f5f5f5',
        },
    },
    menuItemIcon: {
        marginRight: 10,
        fontSize: 16,
        color: '#666',
    },
    menuItemLink: {
        color: '#000',
        textDecoration: 'none',
    },
    logoutText: {
        color: '#ff4d4f',
    },
};

export default AdminHeader;