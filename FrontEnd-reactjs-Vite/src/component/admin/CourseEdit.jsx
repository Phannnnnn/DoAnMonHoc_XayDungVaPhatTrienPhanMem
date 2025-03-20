import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetCourse } from "../../ultill/courseApi";
import { Form, Input, Button, Upload, message, Radio, Space } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { AuthContext } from "../context/auth.context";

const CourseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { auth } = useContext(AuthContext);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadType, setUploadType] = useState('url');
    const [courseType, setCourseType] = useState('paid');

    useEffect(() => {
        const getCourse = async () => {
            const res = await GetCourse(id);

            if (res) {
                // Điền dữ liệu vào form
                form.setFieldsValue({
                    name: res.name,
                    description: res.description,
                    course_img: res.course_img,
                    courseType: res.price === 0 ? 'free' : 'paid',
                    price: res.price,
                    lessons: res.lessons || []
                });

                // Cập nhật state
                setImageUrl(res.course_img);
                setCourseType(res.price === 0 ? 'free' : 'paid');
            }
        }

        getCourse();
    }, [id, form]);

    const uploadProps = {
        name: 'file',
        action: `${import.meta.env.VITE_BACKEND_URL}/v1/api/upload`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} upload thành công`);
                const filePath = info.file.response.filePath;
                setImageUrl(`${import.meta.env.VITE_BACKEND_URL}${filePath}`);
                form.setFieldsValue({ course_img: filePath });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} upload thất bại`);
            }
        },
    };

    const handleUploadTypeChange = (e) => {
        setUploadType(e.target.value);
        setImageUrl('');
        form.setFieldsValue({ course_img: undefined });
    };

    const onFinish = async (values) => {
        try {
            const finalValues = {
                ...values,
                teacher_id: auth?.user?.id,
                price: values.courseType === 'free' ? 0 : Number(values.price)
            };

            console.log("Values gửi đi:", finalValues);
            message.success('Cập nhật thành công!');
            navigate('/manager/course');
        } catch (error) {
            console.error("Lỗi:", error);
            message.error('Có lỗi xảy ra khi cập nhật khóa học!');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: 'calc(100vh - 64px)',
            padding: '20px'
        }}>
            <div style={{ width: '100%', maxWidth: 600 }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#1890ff',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    Chỉnh sửa khóa học
                </h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <Form.Item
                        label="Tên khóa học"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                    >
                        <Input placeholder="Nhập tên khóa học" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học" />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh khóa học"
                        name="course_img"
                        rules={[{ required: true, message: 'Vui lòng thêm ảnh khóa học!' }]}
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
                                            form.setFieldsValue({ course_img: inputUrl });
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
                                                form.setFieldsValue({ course_img: undefined });
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
                        rules={[{ required: true, message: 'Vui lòng chọn loại khóa học!' }]}
                    >
                        <Radio.Group
                            onChange={(e) => {
                                setCourseType(e.target.value);
                                if (e.target.value === 'free') {
                                    form.setFieldsValue({ price: 0 });
                                } else {
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
                                { required: true, message: 'Vui lòng nhập giá khóa học!' },
                                {
                                    type: 'number',
                                    transform: (value) => Number(value),
                                    message: 'Giá khóa học phải là số!'
                                },
                                {
                                    validator: (_, value) => {
                                        const numValue = Number(value);
                                        if (isNaN(numValue) || numValue <= 0) {
                                            return Promise.reject('Giá khóa học phải là số và lớn hơn 0!');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input
                                type="number"
                                min="1"
                                placeholder="Nhập giá khóa học"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    form.setFieldsValue({
                                        price: value ? Number(value) : undefined
                                    });
                                }}
                            />
                        </Form.Item>
                    )}

                    <Form.List name="lessons">
                        {(fields, { add, remove }) => (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ margin: 0 }}>Danh sách bài học</h3>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm bài học
                                    </Button>
                                </div>
                                {fields.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '24px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '8px',
                                        color: '#999'
                                    }}>
                                        Chưa có bài học nào
                                    </div>
                                ) : (
                                    fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                marginBottom: 8,
                                                backgroundColor: '#f5f5f5',
                                                padding: '16px',
                                                borderRadius: '8px'
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'title']}
                                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học!' }]}
                                            >
                                                <Input placeholder="Tiêu đề bài học" style={{ width: '200px' }} />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'content']}
                                                rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học!' }]}
                                            >
                                                <Input.TextArea
                                                    placeholder="Nội dung bài học"
                                                    style={{ width: '300px' }}
                                                    rows={3}
                                                />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                                        </Space>
                                    ))
                                )}
                            </>
                        )}
                    </Form.List>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            Cập nhật khóa học
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CourseEdit;
