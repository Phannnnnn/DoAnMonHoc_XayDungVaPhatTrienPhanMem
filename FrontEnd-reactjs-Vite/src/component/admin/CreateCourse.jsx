import React from 'react';
import { Button, Form, Input } from 'antd';
const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const CreateCourse = () => {
    return <div>
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
                margin: 'auto',
                marginTop: 32
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Tên khóa học"
                name="coursename"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên khóa học!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Mô tả khóa học"
                name="decri"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Ảnh"
                name="img"
            >
                <Input />
            </Form.Item>


            <Form.Item
                label="Giá"
                name="price"
            >
                <Input />
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Đăng khóa học
                </Button>
            </Form.Item>
        </Form>

    </div>
};

export default CreateCourse;

