import React, { Children } from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';
import '../../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2>EduOnline</h2>
                    <p>Empowering learners worldwide with high-quality online education.</p>
                    <div className="social-icons">
                        <a href="#"><i className="fa fa-facebook"></i></a>
                        <a href="#"><i className="fa fa-twitter"></i></a>
                        <a href="#"><i className="fa fa-instagram"></i></a>
                        <a href="#"><i className="fa fa-youtube"></i></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Courses</h3>
                    <ul>
                        <li><a href="#">Web Development</a></li>
                        <li><a href="#">Mobile Development</a></li>
                        <li><a href="#">Data Science</a></li>
                        <li><a href="#">Design</a></li>
                        <li><a href="#">All Courses</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 EduOnline. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
