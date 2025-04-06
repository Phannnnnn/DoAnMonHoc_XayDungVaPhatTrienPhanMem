import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Card, Alert, List } from 'antd';
import { CalendarOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { GetLessonList } from '../../ultill/lessonApi';

const { Content } = Layout;
const { Title, Text } = Typography;

const CourseLearning = () => {
    const { id } = useParams();
    const [videoError, setVideoError] = useState(false);
    const [currentVideo, setCurrentVideo] = useState({});
    const [lessons, setLessons] = useState([]);

    const handleVideoError = () => {
        setVideoError(true);
    };

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await GetLessonList(id);
                if (!Array.isArray(res)) {
                    throw new Error("Dữ liệu trả về không phải là mảng!");
                }
                const sortedLessons = res.sort((a, b) => a.order - b.order);
                setLessons(sortedLessons);
                if (res.length > 0) {
                    setCurrentVideo(res[0]);
                }
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error);
            }
        };
        fetchLessons();
    }, [id]);


    return (
        <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Cột trái: Video và chi tiết bài học */}
            <div style={{ flex: 2, paddingRight: '20px' }}>
                <Card>
                    {videoError ? (
                        <Alert
                            message="Không thể tải video"
                            description="Có vẻ như đã xảy ra sự cố khi tải video. Vui lòng thử lại sau hoặc kiểm tra kết nối internet của bạn."
                            type="error"
                            showIcon
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                paddingTop: '56.25%',
                                position: 'relative',
                                backgroundColor: '#f0f0f0'
                            }}
                        >
                            <iframe
                                src={currentVideo?.video_id ? `https://www.youtube.com/embed/${currentVideo.video_id}` : ""}
                                title={currentVideo?.name || "Video"}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onError={handleVideoError}
                            />
                        </div>
                    )}

                    {/* Video Details */}
                    <Content style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: '10px' }}>
                            {currentVideo.title}
                        </Title>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            <Text type="secondary">
                                <CalendarOutlined style={{ marginRight: '8px' }} />
                                Cập nhật {new Date(currentVideo.updatedAt).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}
                            </Text>
                        </div>
                    </Content>
                </Card>

                {/* Course Navigation */}
                <div
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        gap: '20px' // Khoảng cách giữa hai nút
                    }}
                >
                    <Button
                        disabled={lessons.findIndex(lesson => lesson._id === currentVideo._id) === 0} // Vô hiệu hóa nếu là bài đầu
                        onClick={() => {
                            const currentIndex = lessons.findIndex(lesson => lesson._id === currentVideo._id);
                            if (currentIndex > 0) {
                                setVideoError(false);
                                setCurrentVideo(lessons[currentIndex - 1]);
                            }
                        }}
                    >
                        Bài trước
                    </Button>

                    <Button
                        type="primary"
                        disabled={lessons.findIndex(lesson => lesson._id === currentVideo._id) === lessons.length - 1} // Vô hiệu hóa nếu là bài cuối
                        onClick={() => {
                            const currentIndex = lessons.findIndex(lesson => lesson._id === currentVideo._id);
                            if (currentIndex < lessons.length - 1) {
                                setVideoError(false);
                                setCurrentVideo(lessons[currentIndex + 1]);
                            }
                        }}
                    >
                        Bài tiếp theo
                    </Button>
                </div>

            </div>

            {/* Cột phải: Danh sách các bài học */}
            <div style={{ flex: 1 }}>
                <Card title="Danh sách bài học" style={{ height: '100%' }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={lessons}
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: currentVideo.video_id === item.video_id ? '#e6f7ff' : 'transparent',
                                    borderRadius: '5px',
                                    padding: '10px'
                                }}
                                onClick={() => {
                                    setVideoError(false);
                                    setCurrentVideo(item);
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <img
                                            src={item.lesson_img || `https://i.ytimg.com/vi/${item.video_id}/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCvhOydCVOREo2vIDNsS1lXKWwQgA`}
                                            alt="Thumbnail"
                                            style={{ width: '100px', height: '60px', borderRadius: '5px', objectFit: 'cover' }}
                                        />
                                    }
                                    title={item.title}
                                    description={`Cập nhật ${new Date(item.updatedAt).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}`}
                                />
                            </List.Item>
                        )}
                    />

                </Card>
            </div>
        </div>
    );
};

export default CourseLearning;
