import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetCourse } from "../../ultill/courseApi";
import { Form, Input, Button, Upload, message, Radio, Card, Space, Divider, Spin, Modal, Tooltip } from 'antd';
import {
    UploadOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    EditOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    InfoCircleOutlined,
    FileImageOutlined
} from '@ant-design/icons';
import { AuthContext } from "../context/auth.context";

const CourseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { auth } = useContext(AuthContext);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadType, setUploadType] = useState('url');
    const [courseType, setCourseType] = useState('paid');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    useEffect(() => {
        const getCourse = async () => {
            try {
                setLoading(true);
                const res = await GetCourse(id);

                if (res) {
                    form.setFieldsValue({
                        name: res.name,
                        description: res.description,
                        course_img: res.course_img,
                        courseType: res.price === 0 ? 'free' : 'paid',
                        price: res.price,
                        lessons: res.lessons || []
                    });

                    setImageUrl(res.course_img);
                    setCourseType(res.price === 0 ? 'free' : 'paid');
                }
            } catch (error) {
                message.error('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        getCourse();
    }, [id, form]);

    const uploadProps = {
        name: 'file',
        action: `${import.meta.env.VITE_BACKEND_URL}/v1/api/upload`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status === 'uploading') {
                message.loading('Đang tải ảnh lên...', 0);
            }
            if (info.file.status === 'done') {
                message.destroy();
                message.success({
                    content: 'Tải ảnh thành công',
                    icon: <FileImageOutlined style={{ color: '#52c41a' }} />
                });
                const filePath = info.file.response.filePath;
                const fullUrl = `${import.meta.env.VITE_BACKEND_URL}${filePath}`;
                setImageUrl(fullUrl);
                form.setFieldsValue({ course_img: filePath });
            } else if (info.file.status === 'error') {
                message.destroy();
                message.error('Tải ảnh thất bại. Vui lòng thử lại.');
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
            setSubmitting(true);
            const finalValues = {
                ...values,
                teacher_id: auth?.user?.id,
                price: values.courseType === 'free' ? 0 : Number(values.price)
            };

            // Giả định gọi API cập nhật khóa học ở đây
            console.log("Values gửi đi:", finalValues);

            // Delay giả lập để hiện thị trạng thái đang xử lý
            setTimeout(() => {
                message.success({
                    content: 'Cập nhật khóa học thành công!',
                    icon: <SaveOutlined style={{ color: '#52c41a' }} />
                });
                navigate('/manager/course');
                setSubmitting(false);
            }, 1000);
        } catch (error) {
            console.error("Lỗi:", error);
            message.error('Có lỗi xảy ra khi cập nhật khóa học!');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 64px)'
            }}>
                <Spin size="large" tip="Đang tải thông tin khóa học..." />
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '24px',
        }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            onClick={() => navigate('/manager/course')}
                            style={{ marginRight: '12px' }}
                        />
                        <div>
                            <EditOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            Chỉnh sửa khóa học
                        </div>
                    </div>
                }
                bordered={false}
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '12px' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark="optional"
                    disabled={submitting}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <Card
                                title="Thông tin cơ bản"
                                type="inner"
                                bordered={false}
                                style={{ background: '#f9f9f9', marginBottom: '24px' }}
                            >
                                <Form.Item
                                    label="Tên khóa học"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                                >
                                    <Input
                                        placeholder="Nhập tên khóa học"
                                        maxLength={100}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Mô tả"
                                    name="description"
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Nhập mô tả ngắn về khóa học"
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <Space>
                                            Loại khóa học
                                            <Tooltip title="Khóa học có phí hoặc miễn phí sẽ ảnh hưởng đến số lượng học viên đăng ký">
                                                <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                            </Tooltip>
                                        </Space>
                                    }
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
                                        buttonStyle="solid"
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
                                            prefix="VNĐ"
                                            addonAfter={
                                                <Tooltip title="Giá niêm yết của khóa học">
                                                    <InfoCircleOutlined />
                                                </Tooltip>
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                form.setFieldsValue({
                                                    price: value ? Number(value) : undefined
                                                });
                                            }}
                                        />
                                    </Form.Item>
                                )}
                            </Card>
                        </div>

                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <Card
                                title="Ảnh khóa học"
                                type="inner"
                                bordered={false}
                                style={{ background: '#f9f9f9', marginBottom: '24px' }}
                            >
                                <Form.Item
                                    name="course_img"
                                    rules={[{ required: true, message: 'Vui lòng thêm ảnh khóa học!' }]}
                                >
                                    <div>
                                        <Radio.Group
                                            value={uploadType}
                                            onChange={handleUploadTypeChange}
                                            style={{ marginBottom: '16px' }}
                                            buttonStyle="solid"
                                        >
                                            <Radio.Button value="upload">
                                                <UploadOutlined /> Tải ảnh lên
                                            </Radio.Button>
                                            <Radio.Button value="url">
                                                <LinkOutlined /> Dùng URL
                                            </Radio.Button>
                                        </Radio.Group>

                                        {uploadType === 'upload' ? (
                                            <Upload {...uploadProps}>
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        border: imageUrl ? 'none' : '1px dashed #d9d9d9',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        flexDirection: 'column',
                                                        background: imageUrl ? 'none' : '#fafafa',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {imageUrl ? (
                                                        <>
                                                            <img
                                                                src={imageUrl}
                                                                alt="Ảnh khóa học"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '200px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }}
                                                                onClick={() => setPreviewVisible(true)}
                                                            />
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    background: 'rgba(0,0,0,0.5)',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    opacity: 0,
                                                                    transition: 'opacity 0.3s',
                                                                    borderRadius: '8px'
                                                                }}
                                                                className="image-overlay"
                                                                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                                                onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                                                            >
                                                                <Button type="primary" ghost icon={<UploadOutlined />}>
                                                                    Thay đổi ảnh
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadOutlined style={{ fontSize: '32px', color: '#999' }} />
                                                            <div style={{ marginTop: '8px', color: '#666' }}>
                                                                Nhấp hoặc kéo ảnh vào đây để tải lên
                                                            </div>
                                                            <div style={{ marginTop: '4px', color: '#999', fontSize: '12px' }}>
                                                                Khuyến nghị: JPG, PNG (tỷ lệ 16:9)
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </Upload>
                                        ) : (
                                            <>
                                                <Input
                                                    placeholder="Nhập URL ảnh"
                                                    onChange={(e) => {
                                                        const inputUrl = e.target.value;
                                                        setImageUrl(inputUrl);
                                                        form.setFieldsValue({ course_img: inputUrl });
                                                    }}
                                                    value={imageUrl}
                                                    addonAfter={
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            onClick={() => setPreviewVisible(true)}
                                                            disabled={!imageUrl}
                                                        >
                                                            Xem
                                                        </Button>
                                                    }
                                                />
                                                {imageUrl && (
                                                    <div style={{ marginTop: '12px' }}>
                                                        <img
                                                            src={imageUrl}
                                                            alt="Ảnh khóa học"
                                                            style={{
                                                                width: '100%',
                                                                height: '180px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px'
                                                            }}
                                                            onClick={() => setPreviewVisible(true)}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                message.error({
                                                                    content: 'Không thể tải ảnh. Vui lòng kiểm tra URL.',
                                                                    icon: <WarningOutlined style={{ color: '#ff4d4f' }} />
                                                                });
                                                                setImageUrl('');
                                                                form.setFieldsValue({ course_img: undefined });
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Form.Item>
                            </Card>
                        </div>
                    </div>

                    <Divider orientation="left">
                        <Space>
                            <PlusOutlined />
                            Nội dung khóa học
                        </Space>
                    </Divider>

                    <Form.List name="lessons">
                        {(fields, { add, remove }) => (
                            <Card
                                bordered={false}
                                style={{ background: '#f9f9f9' }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <Space>
                                        <h3 style={{ margin: 0 }}>Danh sách bài học ({fields.length})</h3>
                                        <Tooltip title="Thêm nội dung chi tiết cho từng bài học của khóa học">
                                            <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                        </Tooltip>
                                    </Space>
                                    <Button
                                        type="primary"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm bài học
                                    </Button>
                                </div>
                                {fields.length === 0 ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '48px 24px',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: '1px dashed #d9d9d9'
                                    }}>
                                        <FileTextOutlined style={{ fontSize: '48px', color: '#bfbfbf', marginBottom: '16px' }} />
                                        <p style={{ color: '#8c8c8c', marginBottom: '16px' }}>Chưa có bài học nào</p>
                                        <Button
                                            type="primary"
                                            onClick={() => add()}
                                            icon={<PlusOutlined />}
                                        >
                                            Tạo bài học đầu tiên
                                        </Button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {fields.map(({ key, name, ...restField }, index) => (
                                            <Card
                                                key={key}
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                    borderLeft: '4px solid #1890ff'
                                                }}
                                                bodyStyle={{ padding: '16px' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                    <div style={{
                                                        minWidth: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        background: '#1890ff',
                                                        color: 'white',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        fontWeight: 'bold',
                                                        marginTop: '4px'
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'title']}
                                                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học!' }]}
                                                            style={{ marginBottom: '12px' }}
                                                        >
                                                            <Input
                                                                placeholder="Tiêu đề bài học"
                                                                maxLength={100}
                                                                showCount
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'content']}
                                                            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học!' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Input.TextArea
                                                                placeholder="Nội dung chi tiết của bài học..."
                                                                rows={4}
                                                                maxLength={2000}
                                                                showCount
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: 'Xóa bài học?',
                                                                content: 'Bạn có chắc muốn xóa bài học này?',
                                                                okText: 'Xóa',
                                                                cancelText: 'Hủy',
                                                                okButtonProps: { danger: true },
                                                                onOk: () => remove(name)
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        )}
                    </Form.List>

                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                        <Button
                            onClick={() => navigate('/manager/course')}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={submitting}
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Card>

            <Modal
                visible={previewVisible}
                title="Xem trước ảnh khóa học"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img
                    alt="Ảnh khóa học"
                    style={{ width: '100%' }}
                    src={imageUrl}
                />
            </Modal>
        </div>
    );
};

// Thêm thiếu các icon
const LinkOutlined = () => (
    <svg viewBox="64 64 896 896" focusable="false" data-icon="link" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M574 665.4a8.03 8.03 0 00-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 00-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 000 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 000 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 00-11.3 0L372.3 598.7a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"></path>
    </svg>
);

const FileTextOutlined = () => (
    <svg viewBox="64 64 896 896" focusable="false" data-icon="file-text" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"></path>
    </svg>
);

const WarningOutlined = () => (
    <svg viewBox="64 64 896 896" focusable="false" data-icon="warning" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"></path>
    </svg>
);

export default CourseEdit;