import React, { useContext, useState } from 'react';
import { Button, Form, Input, Upload, message, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';
import { CourseCreate } from '../../ultill/courseApi';
import { useNavigate } from 'react-router-dom';
const CreateCourse = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [uploadType, setUploadType] = useState('upload');
    const [form] = Form.useForm();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {

        const { name, description, course_img, price } = values;
        const teacher_id = auth.user.id;
        const res = await CourseCreate(name, description, course_img, price, teacher_id);

        if (res) {
            message.success('Tạo khóa học thành công!');
            form.resetFields();
            setImageUrl('');
            setUploadType('upload');
            navigate("/manager/course");
        } else {
            message.error('Có lỗi xảy ra khi tạo khóa học!');
        }
    };

    const uploadProps = {
        name: 'file',
        action: `${import.meta.env.VITE_BACKEND_URL}/v1/api/upload`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} upload thành công`);
                // Chỉ lấy filePath từ response, không thêm VITE_BACKEND_URL
                const imageUrl = info.file.response.filePath;
                setImageUrl(imageUrl);
                form.setFieldsValue({ img: imageUrl });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} upload thất bại`);
            }
        },
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: 'calc(100vh - 64px)',
            padding: '10px',
            marginTop: '20px'
        }}>
            <div style={{ width: '100%', maxWidth: 600 }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#1890ff',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    Tạo mới khóa học
                </h2>
                <Form
                    form={form}
                    layout="vertical"
                    name="create-course"
                    style={{
                        maxWidth: 600,
                        width: '100%',
                        background: 'white',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên khóa học"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên khóa học!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả khóa học" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh khóa học"
                        name="course_img"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng thêm ảnh khóa học!',
                            },
                        ]}
                    >
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <Radio.Group
                                    value={uploadType}
                                    onChange={(e) => {
                                        setUploadType(e.target.value);
                                        setImageUrl('');
                                        form.setFieldsValue({ img: undefined });
                                    }}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <Radio.Button value="upload">Upload ảnh</Radio.Button>
                                    <Radio.Button value="url">Nhập URL</Radio.Button>
                                </Radio.Group>

                                {uploadType === 'upload' ? (
                                    <Upload {...uploadProps} showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                    </Upload>
                                ) : (
                                    <Input
                                        placeholder="Nhập URL ảnh"
                                        onChange={(e) => {
                                            setImageUrl(e.target.value);
                                            form.setFieldsValue({ img: e.target.value });
                                        }}
                                        value={imageUrl}
                                    />
                                )}
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {imageUrl && (
                                    <div style={{
                                        width: '200px',
                                        height: '200px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}${imageUrl}`}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập giá khóa học!',
                            },
                            {
                                pattern: /^[0-9]+$/,
                                message: 'Giá khóa học phải là số!',
                            }
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            Đăng khóa học
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CreateCourse;
