import React, { useContext, useState } from 'react';
import { Menu, Input, Button, Avatar, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/auth.contex.jsx';

const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);
const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    console.log(auth);

    // Giả lập trạng thái đăng nhập và thông tin user
    const [user, setUser] = useState({
        name: auth?.userLogin?.name ?? "",
        avatar: '', // Nếu chưa có avatar, sẽ hiển thị icon mặc định
    });

    const handleLogout = () => {
        setAuth({
            isAuthenticated: false,
            user: {
                email: "",
                name: "",
                role: ""
            }
        });
        setUser({});
        localStorage.clear("token");
        navigate("/");
    };

    const userMenu = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link to="">Trang cá nhân</Link>,
        },
        {
            key: 'coursesmanager',
            icon: <SettingOutlined />,
            label: <Link to="/coursesmanager">Quản lý khóa học</Link>,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
    ];

    const menuItems = [
        { label: <Link to="/">Trang chủ</Link>, key: '/' },
        { label: <Link to="/course">Khoá học</Link>, key: '/course' },
        auth.isAuthenticated && { label: <Link to="/usermanager">Người dùng</Link>, key: '/usermanager' },
    ];

    return (
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

            <div style={{ marginRight: 36 }}><Search placeholder="input search text" onSearch={onSearch} enterButton /></div>
            <div style={styles.actions}>
                <div>
                    {auth.isAuthenticated ? (
                        <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
                            <div style={{ cursor: 'pointer' }}>
                                <Avatar src={user.avatar} icon={!user.avatar && <UserOutlined />} />
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

export default Header;
