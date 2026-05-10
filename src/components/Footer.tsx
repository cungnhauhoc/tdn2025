import React from 'react';
import { BrandIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand-info">
          <BrandIcon />
          <div className="footer-brand-text">
            <span className="footer-name">Tra Cứu Điểm Thi</span>
            <span className="footer-desc">Nền tảng tra cứu và phân tích dữ liệu tuyển sinh lớp 6</span>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Cùng Nhau Học. Tất cả quyền được bảo lưu.
          </div>
          <div className="footer-nav">
            <a href="https://cungnhauhoc.net" target="_blank" rel="noopener noreferrer" className="footer-link">Trang chủ</a>
            <a href="#" className="footer-link">Liên hệ</a>
            <a href="#" className="footer-link">Chính sách</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
