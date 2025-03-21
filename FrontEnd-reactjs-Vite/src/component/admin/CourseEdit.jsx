import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetCourse } from "../../ultill/courseApi";
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Radio,
    Card,
    Typography,
    Divider,
    Spin,
    Modal,
    Tooltip,
    Row,
    Col,
    InputNumber,
    Empty
} from 'antd';
import {
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    InfoCircleOutlined,
    PictureOutlined,
    DollarOutlined,
    BookOutlined
} from '@ant-design/icons';
import { AuthContext } from "../context/auth.context";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CourseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [courseType, setCourseType] = useState('paid');

    // Tải dữ liệu khóa học
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await GetCourse(id);

                if (response) {
                    // Cập nhật form với dữ liệu từ API
                    form.setFieldsValue({
                        name: response.name,
                        description: response.description,
                        courseImage: response.course_img,
                        courseType: response.price === 0 ? 'free' : 'paid',
                        price: response.price || 0,
                        lessons: response.lessons || []
                    });

                    setImageUrl(response.course_img);
                    setCourseType(response.price === 0 ? 'free' : 'paid');
                }
            } catch (error) {
                message.error('Không thể tải thông tin khóa học');
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, form]);

    // Upload ảnh
    const handleImageUpload = (info) => {
        if (info.file.status === 'uploading') {
            message.loading({ content: 'Đang tải ảnh...', key: 'upload' });
            return;
        }

        if (info.file.status === 'done') {
            message.success({ content: 'Tải ảnh thành công', key: 'upload' });
            const filePath = info.file.response.filePath;
            const fullUrl = `${import.meta.env.VITE_BACKEND_URL}${filePath}`;
            setImageUrl(fullUrl);
            form.setFieldsValue({ courseImage: filePath });
        } else if (info.file.status === 'error') {
            message.error({ content: 'Tải ảnh thất bại', key: 'upload' });
        }
    };

    // Xử lý khi submit form
    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);

            // Chuẩn bị dữ liệu gửi đi
            const formData = {
                name: values.name,
                description: values.description,
                course_img: values.courseImage,
                price: values.courseType === 'free' ? 0 : values.price,
                teacher_id: auth?.user?.id,
                lessons: values.lessons || []
            };

            console.log('Dữ liệu gửi đi:', formData);

            // TODO: Gọi API cập nhật khóa học ở đây
            // Mô phỏng gọi API
            setTimeout(() => {
                message.success('Cập nhật khóa học thành công');
                navigate('/manager/course');
                setSubmitting(false);
            }, 1000);
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật khóa học');
            console.error('Lỗi cập nhật:', error);
            setSubmitting(false);
        }
    };

    // Hiển thị spinner khi đang tải
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin size="large" tip="Đang tải thông tin khóa học..." fullscreen />
            </div>
        );
    }

    return (
        <div className="course-edit-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/manager/course')}
                            style={{ marginRight: '8px' }}
                        />
                        <EditOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        <span>Chỉnh sửa khóa học</span>
                    </div>
                }
                variant="outlined"
                style={{ boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        courseType: 'paid',
                        lessons: []
                    }}
                    disabled={submitting}
                >
                    <Row gutter={24}>
                        {/* Thông tin cơ bản */}
                        <Col xs={24} md={14}>
                            <Card
                                className="info-card"
                                title={<Title level={5}><BookOutlined /> Thông tin cơ bản</Title>}
                                style={{ marginBottom: '24px' }}
                                size="small"
                            >
                                <Form.Item
                                    name="name"
                                    label="Tên khóa học"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
                                >
                                    <Input placeholder="Nhập tên khóa học" maxLength={100} showCount />
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Mô tả khóa học"
                                >
                                    <TextArea
                                        placeholder="Mô tả chi tiết về khóa học này..."
                                        autoSize={{ minRows: 4, maxRows: 8 }}
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="courseType"
                                    label={
                                        <span>
                                            Loại khóa học
                                            <Tooltip title="Chọn khóa học có phí hoặc miễn phí">
                                                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#1890ff' }} />
                                            </Tooltip>
                                        </span>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng chọn loại khóa học' }]}
                                >
                                    <Radio.Group
                                        onChange={(e) => setCourseType(e.target.value)}
                                        optionType="button"
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value="paid">
                                            <DollarOutlined /> Có phí
                                        </Radio.Button>
                                        <Radio.Button value="free">
                                            Miễn phí
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                {courseType === 'paid' && (
                                    <Form.Item
                                        name="price"
                                        label="Giá khóa học"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập giá khóa học' },
                                            { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' }
                                        ]}
                                    >
                                        <InputNumber
                                            min={1}
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            placeholder="Nhập giá khóa học (VNĐ)"
                                            addonAfter="VNĐ"
                                        />
                                    </Form.Item>
                                )}
                            </Card>
                        </Col>

                        {/* Ảnh khóa học */}
                        <Col xs={24} md={10}>
                            <Card
                                className="image-card"
                                title={<Title level={5}><PictureOutlined /> Ảnh khóa học</Title>}
                                style={{ marginBottom: '24px' }}
                                size="small"
                            >
                                <Form.Item
                                    name="courseImage"
                                    rules={[{ required: true, message: 'Vui lòng thêm ảnh cho khóa học' }]}
                                >
                                    <div className="upload-container">
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action={`${import.meta.env.VITE_BACKEND_URL}/v1/api/upload`}
                                            headers={{
                                                authorization: `Bearer ${localStorage.getItem("token")}`
                                            }}
                                            onChange={handleImageUpload}
                                        >
                                            {imageUrl ? (
                                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                    <img
                                                        src={imageUrl}
                                                        alt="Ảnh khóa học"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            background: 'rgba(0,0,0,0.45)',
                                                            opacity: 0,
                                                            transition: 'all 0.3s',
                                                            cursor: 'pointer'
                                                        }}
                                                        className="image-overlay"
                                                        onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                                                        onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
                                                    >
                                                        <Text style={{ color: 'white' }}>Nhấn để thay đổi</Text>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ padding: '24px 0' }}>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                                </div>
                                            )}
                                        </Upload>

                                        {imageUrl && (
                                            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                                <Button
                                                    type="link"
                                                    onClick={() => setPreviewVisible(true)}
                                                >
                                                    Xem trước
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Form.Item>

                                <Text type="secondary">
                                    Hình ảnh là một phần quan trọng của khóa học. Hãy chọn hình ảnh chất lượng cao,
                                    rõ ràng và liên quan đến nội dung khóa học để thu hút người học.
                                </Text>
                            </Card>
                        </Col>
                    </Row>

                    {/* Nội dung khóa học */}
                    <Card
                        className="lessons-card"
                        title={<Title level={5}><BookOutlined /> Nội dung khóa học</Title>}
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    const lessons = form.getFieldValue('lessons') || [];
                                    const newLessons = [...lessons, { title: '', content: '' }];
                                    form.setFieldsValue({ lessons: newLessons });
                                }}
                            >
                                Thêm bài học
                            </Button>
                        }
                    >
                        <Form.List name="lessons">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.length === 0 ? (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description="Chưa có bài học nào. Hãy thêm bài học đầu tiên!"
                                        >
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={() => add()}
                                            >
                                                Thêm bài học
                                            </Button>
                                        </Empty>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {fields.map(({ key, name, ...restField }, index) => (
                                                <Card
                                                    key={key}
                                                    size="small"
                                                    style={{
                                                        marginBottom: 8,
                                                        borderLeft: '3px solid #1890ff'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <div
                                                            style={{
                                                                width: '28px',
                                                                height: '28px',
                                                                borderRadius: '50%',
                                                                backgroundColor: '#1890ff',
                                                                color: 'white',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginRight: '16px',
                                                                fontWeight: 'bold',
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'title']}
                                                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học' }]}
                                                                style={{ marginBottom: '12px' }}
                                                            >
                                                                <Input placeholder="Tiêu đề bài học" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'content']}
                                                                rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học' }]}
                                                                style={{ marginBottom: 0 }}
                                                            >
                                                                <TextArea
                                                                    placeholder="Nội dung chi tiết bài học..."
                                                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => remove(name)}
                                                            style={{ marginLeft: '8px' }}
                                                        />
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </Form.List>
                    </Card>

                    {/* Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                        <Button
                            onClick={() => navigate('/manager/course')}
                        >
                            Hủy bỏ
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

            {/* Modal xem trước ảnh */}
            <Modal
                open={previewVisible}
                title="Xem trước ảnh khóa học"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Ảnh khóa học" style={{ width: '100%' }} src={imageUrl} />
            </Modal>
        </div>
    );
};

export default CourseEdit;
