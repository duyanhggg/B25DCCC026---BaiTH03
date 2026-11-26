import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export const MainLayout: React.FC = () => {
  return (
    <div className="aura-shell">
      <Header />
      <main className="aura-body">
        <Outlet />
      </main>

      {/* Trust & Guarantee Section */}
      <section className="aura-trust-strip">
        <div className="trust-grid">
          <div className="trust-item">
            <Truck className="trust-icon" size={24} />
            <div>
              <h4>Giao hàng hỏa tốc</h4>
              <p>Miễn phí vận chuyển cho mọi đơn hàng</p>
            </div>
          </div>
          <div className="trust-item">
            <ShieldCheck className="trust-icon" size={24} />
            <div>
              <h4>Chính hãng 100%</h4>
              <p>Cam kết chất lượng chuẩn quốc tế</p>
            </div>
          </div>
          <div className="trust-item">
            <RefreshCw className="trust-icon" size={24} />
            <div>
              <h4>Đổi trả linh hoạt</h4>
              <p>Đổi hàng miễn phí trong vòng 30 ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="aura-footer">
        <div className="footer-inner">
          <div className="footer-col-brand">
            <div className="footer-logo">AuraStore</div>
            <p>Hệ thống mua sắm trực tuyến tinh hoa — Bài thực hành Context API & Redux Toolkit.</p>
          </div>
          <div className="footer-col-links">
            <span className="footer-heading">Liên kết nhanh</span>
            <Link to="/">Trang chủ</Link>
            <Link to="/cart">Giỏ hàng</Link>
            <Link to="/checkout">Thanh toán</Link>
          </div>
          <div className="footer-col-meta">
            <span className="footer-heading">Phiên bản</span>
            <p>ShopMini v2.0 - Signature Edition</p>
            <p className="credit-line">
              Crafted with <Heart size={14} className="heart-icon" /> by Student
            </p>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} AuraStore Inc. Mọi quyền được bảo lưu.
        </div>
      </footer>
    </div>
  );
};
