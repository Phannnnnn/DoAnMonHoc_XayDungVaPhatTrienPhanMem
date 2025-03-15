import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
const { Title, Text, Link } = Typography;
import { UserRegister } from '../../ultill/api.js';
import { useNavigate } from "react-router";


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
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
            <Title level={3}>Đăng ký tài khoản</Title>
            <Text type="secondary">Nhập thông tin của bạn để tạo tài khoản</Text>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
                >
                    <Input placeholder="John Doe" />
                </Form.Item>

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
                >
                    <Input.Password
                        placeholder="Password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Các mật khẩu đã nhập không khớp. Hãy thử lại.!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>

            <Text>
                Bạn đã có tài khoản? <Link href="/login">Đăng nhập</Link>
            </Text>
        </div>
    );
}

export default RegisterPage;
