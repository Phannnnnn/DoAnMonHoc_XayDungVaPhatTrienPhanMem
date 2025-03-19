import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { UserLogin } from '../../ultill/userApi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuth, auth } = useContext(AuthContext);

    useEffect(() => {
        console.log("Auth đã được cập nhật:", auth);
    }, [auth]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { email, password } = values;

            const res = await UserLogin(email, password);

            if (res && res.EC === 0) {
                localStorage.setItem('token', res.accessToken);

                const authData = {
                    isAuthenticated: true,
                    user: {
                        id: res?.userLogin?._id ?? "",
                        email: res?.userLogin?.email ?? "",
                        name: res?.userLogin?.name ?? "",
                        role: res?.userLogin?.role ?? "",
                    }
                };

                await setAuth(authData);

                message.success('Đăng nhập thành công!');
                navigate("/");
            } else {
                message.error('Email hoặc mật khẩu không chính xác!');
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            message.error('Có lỗi xảy ra khi đăng nhập!');
        } finally {
            setLoading(false);
        }
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
                        Đăng nhập
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
