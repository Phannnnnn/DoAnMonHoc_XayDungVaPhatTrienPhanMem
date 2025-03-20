import React, { useContext, useState } from 'react';
import { Button, Form, Input, Upload, message, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';
import { CourseCreate } from '../../ultill/courseApi';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [uploadType, setUploadType] = useState('upload');
    const [courseType, setCourseType] = useState('paid');
    const [form] = Form.useForm();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            // Xử lý giá dựa vào loại khóa học
            const finalValues = {
                ...values,
                teacher_id: auth.user.id,
                price: values.courseType === 'free' ? 0 : values.price
            };


            console.log("Values gửi đi:", finalValues);

            const { name, description, img, price, teacher_id } = finalValues;

            const res = await CourseCreate(name, description, img, price, teacher_id);


            if (res) {
                message.success('Tạo khóa học thành công!');
                navigate("/manager/course");

            }
            else {
                message.error(res?.message || 'Có lỗi xảy ra khi tạo khóa học!');
            }
        } catch (error) {
            console.error("Lỗi:", error);
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
                const fullImageUrl = `${import.meta.env.VITE_BACKEND_URL}${info.file.response.filePath}`;
                setImageUrl(fullImageUrl);
                console.log("fullImageUrl >> :", imageUrl);
                form.setFieldsValue({ img: fullImageUrl });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} upload thất bại`);
            }
        },
    };

    const handleUploadTypeChange = (e) => {
        setUploadType(e.target.value);
        setImageUrl('');
        form.setFieldsValue({ img: undefined });
        form.validateFields(['img']);
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
                    autoComplete="on"
                    initialValues={{
                        courseType: 'paid'
                    }}
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
                        label={<>Ảnh khóa học <span style={{ color: '#ff4d4f' }}>*</span></>}
                        name="img"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng thêm ảnh khóa học!',
                            },
                            {
                                validator: (_, value) => {
                                    if (!imageUrl) {
                                        return Promise.reject('Vui lòng thêm ảnh khóa học!');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <Radio.Group
                                    value={uploadType}
                                    onChange={handleUploadTypeChange}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <Radio.Button value="upload">Upload ảnh</Radio.Button>
                                    <Radio.Button value="url">Nhập URL</Radio.Button>
                                </Radio.Group>

                                {uploadType === 'upload' ? (
                                    <Upload {...uploadProps}>
                                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                    </Upload>
                                ) : (
                                    <Input
                                        placeholder="Nhập URL ảnh"
                                        onChange={(e) => {
                                            const inputUrl = e.target.value;
                                            setImageUrl(inputUrl);
                                            form.setFieldsValue({ img: inputUrl });
                                            form.validateFields(['img']);
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
                                            src={imageUrl}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                message.error('Không thể tải ảnh. Vui lòng kiểm tra URL.');
                                                setImageUrl('');
                                                form.setFieldsValue({ img: undefined });
                                                form.validateFields(['img']);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="Loại khóa học"
                        name="courseType"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại khóa học!',
                            },
                        ]}
                    >
                        <Radio.Group
                            value={courseType}
                            onChange={(e) => {
                                setCourseType(e.target.value);
                                if (e.target.value === 'free') {
                                    form.setFieldsValue({ price: 0 });
                                } else {
                                    // Reset giá về undefined khi chuyển sang có phí
                                    form.setFieldsValue({ price: undefined });
                                }
                            }}
                        >
                            <Radio.Button value="paid">Có phí</Radio.Button>
                            <Radio.Button value="free">Miễn phí</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {courseType === 'paid' && (
                        <Form.Item
                            label="Giá (VNĐ)"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá khóa học!',
                                },
                                {
                                    pattern: /^[0-9]+$/,
                                    message: 'Giá khóa học phải là số và lớn hơn 0!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (value <= 0) {
                                            return Promise.reject('Giá khóa học phải lớn hơn 0!');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input type="number" min="1" placeholder="Nhập giá khóa học" />
                        </Form.Item>
                    )}

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
