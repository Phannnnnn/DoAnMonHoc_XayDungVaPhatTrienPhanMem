import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        console.log('Login values:', values);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div style={{
            maxWidth: 400,
            margin: 'auto',
            marginTop: 20,
            marginBottom: 20,
            padding: 24,
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <Title level={3}>Đăng nhập</Title>
            <Text type="secondary">Nhập email và mật khẩu của bạn để đăng nhập</Text>

            <Form
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập vào email!' },
                        { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' },
                    ]}
                >
                    <Input placeholder="m@example.com" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập vào mật khẩu!' }]}
                    style={{ marginBottom: 0 }}
                >
                    <Input.Password
                        placeholder="Password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <div style={{ textAlign: 'right', marginBottom: 16 }}>
                    <Link href="#">Quên mật khẩu</Link>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Login
                    </Button>
                </Form.Item>
            </Form>

            <Text>
                Bạn chưa có tài khoản? <Link href="/register">Đăng ký</Link>
            </Text>
        </div>
    );
}

export default LoginPage;
