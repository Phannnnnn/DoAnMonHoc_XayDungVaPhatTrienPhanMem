import React from "react";
import { Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../../styles/homepage.css';

const carouselData = [
    {
        title: "Thành Quả của Học Viên",
        description: "Để đạt được kết quả tốt trong mọi việc ta cần xác định mục tiêu rõ ràng cho việc đó. Học lập trình cũng không là ngoại lệ.",
        buttonText: "XEM THÀNH QUẢ",
        imageUrl: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_04_2.png"
    },
    {
        title: "Khóa Học Chất Lượng",
        description: "Học theo lộ trình rõ ràng, bài bản từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu.",
        buttonText: "XEM KHÓA HỌC",
        imageUrl: "https://files.fullstack.edu.vn/f8-prod/banners/37/66b5a6b16d31a.png"
    },
    {
        title: "Khóa Học Chất Lượng",
        description: "Học theo lộ trình rõ ràng, bài bản từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu.",
        buttonText: "XEM KHÓA HỌC",
        imageUrl: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_01_2.png"
    },
    {
        title: "Khóa Học Chất Lượng",
        description: "Học theo lộ trình rõ ràng, bài bản từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu.",
        buttonText: "XEM KHÓA HỌC",
        imageUrl: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_03_youtube.png"
    },
];

const HomePage = () => {
    const NextArrow = (props) => (
        <div className="custom-arrow next" onClick={props.onClick}>
            <RightOutlined />
        </div>
    );

    const PrevArrow = (props) => (
        <div className="custom-arrow prev" onClick={props.onClick}>
            <LeftOutlined />
        </div>
    );

    return (
        <div className="homepage-container">
            <Carousel
                arrows
                prevArrow={<PrevArrow />}
                nextArrow={<NextArrow />}
                autoplay
                className="main-carousel"
            >
                {carouselData.map((slide, index) => (
                    <div key={index} className="carousel-slide">
                        <div className="slide-content">
                            <h1>{slide.title}</h1>
                            <p>{slide.description}</p>
                            <Button type="primary" className="slide-button">
                                {slide.buttonText}
                            </Button>
                        </div>
                        <div className="slide-image">
                            <img src={slide.imageUrl} alt={slide.title} />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HomePage;
