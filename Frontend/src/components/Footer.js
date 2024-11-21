import React from "react";
import { Link } from "react-router-dom";
import { BsLinkedin, BsGithub, BsYoutube, BsInstagram } from "react-icons/bs";
import newsletter from "../images/newsletter.png";
const Footer = () => {
  return (
    <>
      <footer className="py-4" style={{ backgroundColor: "black" }}>
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <img src={newsletter} alt="newsletter" />
                <h2 className="mb-0 text-white">Đăng ký nhận bản tin</h2>
              </div>
            </div>
            <div className="col-7">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-1"
                  placeholder="Nhập gmail ở đây"
                  aria-label="Your Email Address"
                  aria-describedby="basic-addon2"
                />
                <span className="input-group-text p-2" id="basic-addon2" style={{ backgroundColor: "black" }}>
                  Đăng ký
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-4" style={{ backgroundColor: "black" }}>
        <div className="container-xxl">
          <div className="row">
            <div className="col-4">
              <h4 className="text-white mb-4">Liên hệ với chúng tôi</h4>
              <div>
                <address className="text-white fs-6">
                Địa chỉ : 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh. <br />
                </address>
                <a
                  href="tel:+84 971035440"
                  className="mt-3 d-block mb-1 text-white"
                >
                  +84 971035440
                </a>
                <a
                  href="mailto:quangle.24022003@gmail.com"
                  className="mt-2 d-block mb-0 text-white"
                >
                  quangle.24022003@gmail.com
                </a>
                <div className="social_icons d-flex align-items-center gap-30 mt-4">
                  <a className="text-white" href="#">
                    <BsLinkedin className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsInstagram className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsGithub className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsYoutube className="fs-4" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Thông tin</h4>
              <div className="footer-link d-flex flex-column">
                <Link to="/privacy-policy" className="text-white py-2 mb-1">
                  Chính sách bảo hành
                </Link>
                <Link to="/refund-policy" className="text-white py-2 mb-1">
                  Chính sách hoàn trả
                </Link>
                <Link to="/shipping-policy" className="text-white py-2 mb-1">
                  Chính sách vận chuyển
                </Link>
                <Link to="/term-conditions" className="text-white py-2 mb-1">
                  Điều khoản & dịch vụ
                </Link>
                <Link to="/blogs" className="text-white py-2 mb-1">Bài viết</Link>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Tài khoản</h4>
              <div className="footer-link d-flex flex-column">
                <Link to="/contact" className="text-white py-2 mb-1">Liên hệ</Link>
                <Link className="text-white py-2 mb-1">Câu hỏi thường gặp</Link>
                <Link className="text-white py-2 mb-1">Về chúng tôi</Link>
              </div>
            </div>
            <div className="col-2">
              <h4 className="text-white mb-4">Liên kết nhanh</h4>
              <div className="footer-link d-flex flex-column">
              <Link className="text-white py-2 mb-1">Hoàng Bào</Link>
                <Link className="text-white py-2 mb-1">Áo Dài</Link>
                <Link className="text-white py-2 mb-1">Áo Nhật Bình</Link>
                <Link className="text-white py-2 mb-1">Áo Ngũ Thân</Link>
                <Link className="text-white py-2 mb-1">Áo Giao Lĩnh</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-4" style={{ backgroundColor: "black" }}>
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <p className="text-center mb-0 text-white">
                &copy; {new Date().getFullYear()}; Được phát triển bở Sắc
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
