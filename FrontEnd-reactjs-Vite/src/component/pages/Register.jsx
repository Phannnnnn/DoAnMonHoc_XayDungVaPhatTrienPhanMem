import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Divider, Space, Row, Col } from 'antd';
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    MailOutlined,
    UserOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { UserRegister } from '../../ultill/userApi.js';
import { useNavigate } from "react-router";

const { Title, Text, Link, Paragraph } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    //Ham submit form
    const onFinish = async (values) => {
        setLoading(true);
        const { name, email, password } = values;

        //Goi api dang ki tai khoan
        const res = await UserRegister(name, email, password);

        if (res) {
            message.success('Đăng ký thành công.');
            navigate("/login");
            setLoading(false);
        }
        else {
            message.error('Đăng ký không thành công vui lòng kiểm tra lại thông tin email!');
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <Row gutter={[0, 0]} className="register-row">
                    <Col xs={24} md={12} className="register-left">
                        <div className="register-image-container">
                            <div className="register-welcome">
                                <CheckCircleOutlined className="welcome-icon" />
                                <Title level={2}>Tham gia cùng chúng tôi!</Title>
                                <Paragraph>
                                    Đăng ký để bắt đầu hành trình học tập và phát triển kỹ năng của bạn.
                                </Paragraph>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} md={12} className="register-right">
                        <div className="register-form-container">
                            <div className="register-header">
                                <Title level={3}>Đăng ký tài khoản</Title>
                                <Text type="secondary">
                                    Nhập thông tin của bạn để tạo tài khoản
                                </Text>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                className="register-form"
                            >
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        placeholder="Họ và tên"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập vào email!' },
                                        { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="site-form-item-icon" />}
                                        placeholder="Email"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập vào mật khẩu!' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        placeholder="Mật khẩu"
                                        size="large"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Các mật khẩu đã nhập không khớp. Hãy thử lại!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        placeholder="Xác nhận mật khẩu"
                                        size="large"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                        size="large"
                                        className="register-button"
                                    >
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider plain>
                                <Text type="secondary">Hoặc</Text>
                            </Divider>

                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Button block size="large" className="social-button google-button">
                                    Đăng ký với Google
                                </Button>
                                <Button block size="large" className="social-button facebook-button">
                                    Đăng ký với Facebook
                                </Button>
                            </Space>

                            <div className="login-link">
                                <Text>
                                    Bạn đã có tài khoản? <Link href="/login">Đăng nhập</Link>
                                </Text>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <style jsx>{`
                .register-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f5f8fa;
                    padding: 20px;
                }
                
                .register-box {
                    width: 100%;
                    max-width: 900px;
                    background-color: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                
                .register-row {
                    min-height: 600px;
                }
                
                .register-left {
                    background: linear-gradient(135deg, #52c41a, #135200);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .register-image-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    color: white;
                    text-align: center;
                    padding: 40px;
                }
                
                .register-welcome {
                    z-index: 2;
                    position: relative;
                }
                
                .welcome-icon {
                    font-size: 64px;
                    margin-bottom: 24px;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 20px;
                    border-radius: 50%;
                }
                
                .register-image-container h2 {
                    color: white !important;
                    margin-bottom: 16px;
                }
                
                .register-image-container p {
                    color: rgba(255, 255, 255, 0.9) !important;
                    font-size: 16px;
                }
                
                .register-right {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                }
                
                .register-form-container {
                    width: 100%;
                    max-width: 360px;
                }
                
                .register-header {
                    margin-bottom: 24px;
                    text-align: center;
                }
                
                .register-form {
                    margin-top: 24px;
                }
                
                .register-button {
                    height: 48px;
                    font-size: 16px;
                    font-weight: 500;
                    margin-top: 16px;
                }
                
                .social-button {
                    height: 48px;
                    font-size: 14px;
                    border-radius: 6px;
                }
                
                .google-button {
                    background-color: #ffffff;
                    color: rgba(0, 0, 0, 0.85);
                    border: 1px solid #e6e6e6;
                }
                
                .google-button:hover {
                    background-color: #f5f5f5;
                    border-color: #d9d9d9;
                }
                
                .facebook-button {
                    background-color: #1877f2;
                    color: #ffffff;
                    border: none;
                }
                
                .facebook-button:hover {
                    background-color: #166fe5;
                }
                
                .login-link {
                    margin-top: 24px;
                    text-align: center;
                }
                
                /* Responsive Styles */
                @media (max-width: 768px) {
                    .register-left {
                        display: none;
                    }
                    
                    .register-right {
                        padding: 40px 20px;
                    }
                }
                
                /* Form Icons Styling */
                .site-form-item-icon {
                    color: rgba(0, 0, 0, 0.45);
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;