import React, { Children } from 'react';
import { Menu, Input, Button, Dropdown, Space, Flex, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined, BookOutlined, DownOutlined, SettingOutlined, FileSearchOutlined } from '@ant-design/icons';

const { Search } = Input;

const Header = () => {
    const menuItems = [
        {
            label: <Link to="/">Trang chủ</Link>,
            key: 'home',
        },
        {
            label: 'Khóa học',
            key: 'SubMenu',
            children: [
                {
                    type: 'group',
                    children: [
                        {
                            label: 'Option 1',
                            key: 'setting:1',
                        },
                        {
                            label: 'Option 2',
                            key: 'setting:2',
                        },
                    ],
                },
            ],
        },
        {
            label: <Link to="">About</Link>,
            key: 'about',
        },
        {
            label: <Link to="">Contact</Link>,
            key: 'contact',
        },
    ];

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <BookOutlined style={{ fontSize: 24 }} />
                <span style={{ marginLeft: 8, fontWeight: 'bold', fontSize: 20 }}>EduOnline</span>
            </div>

            <Menu mode="horizontal" items={menuItems} style={styles.menu} />

            <div style={styles.actions}>
                <Search
                    placeholder="input search text"
                />
            </div>
            <div>
                <Link to="/login" style={styles.link}>
                    <Button type="text">Đăng nhập</Button>
                </Link>
                <Link to="/register" style={styles.link}>
                    <Button color="default" variant="solid">
                        Đăng ký
                    </Button>
                </Link>
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
        gap: '8px',
    },
    link: {
        marginLeft: '8px',
    },
};

export default Header;
