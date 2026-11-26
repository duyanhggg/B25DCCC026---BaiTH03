import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Sparkles, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectCartItems,
  selectTotalPrice,
  selectTotalQuantity,
  clearCart,
} from '../features/cart/cartSlice';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatVND } from '../utils/format';

export const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const totalPrice = useAppSelector(selectTotalPrice);
  const { user } = useAuth();

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [address, setAddress] = useState('Km10, Đường Nguyễn Trãi, Hà Đông, Hà Nội (PTIT)');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearCart());
    setOrderSuccess(true);
    showToast({
      type: 'success',
      title: 'Đặt hàng thành công!',
      message: `Đơn hàng của ${user?.username} đã được ghi nhận.`,
    });
  };

  if (orderSuccess) {
    return (
      <div className="checkout-success-view">
        <div className="success-glass-card">
          <div className="success-icon-pulse">
            <CheckCircle2 size={56} />
          </div>
          <span className="success-pill">Đã xác nhận thanh toán</span>
          <h2>Đặt hàng thành công!</h2>
          <p>
            Cảm ơn quý khách <strong>{user?.username}</strong> đã tin chọn AuraStore. Đơn hàng đang được chuẩn bị và chuyển phát an toàn tới địa chỉ của bạn.
          </p>

          <div className="success-order-details">
            <div className="info-row">
              <span>Người nhận:</span> <strong>{user?.username}</strong>
            </div>
            <div className="info-row">
              <span>Địa chỉ:</span> <strong>{address}</strong>
            </div>
            <div className="info-row">
              <span>Phương thức:</span> <strong>{paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản / QR Code'}</strong>
            </div>
            <div className="info-row">
              <span>Tổng thanh toán:</span> <strong style={{ color: 'var(--accent-brand)' }}>{formatVND(totalPrice)}</strong>
            </div>
          </div>

          <Link to="/" className="btn-glow-primary">
            <Sparkles size={16} /> Tiếp tục khám phá sản phẩm mới
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="state-empty-box">
        <div className="empty-bubble-icon">
          <ShoppingBag size={48} />
        </div>
        <h2>Không có sản phẩm để thanh toán</h2>
        <p>Vui lòng chọn các sản phẩm bạn muốn đặt trước khi bước vào trang thanh toán.</p>
        <Link to="/" className="btn-glow-primary">
          Xem danh mục sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-experience">
      <div className="checkout-header-area">
        <h1>Xác nhận đặt hàng & Thanh toán</h1>
        <p>Bảo mật giao dịch đa tầng được bảo đảm bởi hệ thống AuraStore</p>
      </div>

      <div className="checkout-grid-layout">
        {/* Form Column */}
        <div className="checkout-form-column">
          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-card-section">
              <div className="section-title-row">
                <MapPin size={20} className="section-icon" />
                <h3>Thông tin người nhận & Địa chỉ giao hàng</h3>
              </div>

              <div className="form-field">
                <label>Tài khoản khách hàng</label>
                <input type="text" value={user?.username || ''} disabled className="input-readonly" />
              </div>

              <div className="form-field">
                <label htmlFor="checkout-address">Địa chỉ chi tiết nhận hàng</label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="checkout-card-section">
              <div className="section-title-row">
                <CreditCard size={20} className="section-icon" />
                <h3>Phương thức thanh toán</h3>
              </div>

              <div className="payment-select-group">
                <label className={`payment-pill-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="pay-method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="pill-content">
                    <span className="pill-title">Thanh toán khi nhận hàng (COD)</span>
                    <span className="pill-desc">Kiểm tra hàng trước khi thanh toán tiền mặt</span>
                  </div>
                </label>

                <label className={`payment-pill-card ${paymentMethod === 'banking' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="pay-method"
                    value="banking"
                    checked={paymentMethod === 'banking'}
                    onChange={() => setPaymentMethod('banking')}
                  />
                  <div className="pill-content">
                    <span className="pill-title">Chuyển khoản Ngân hàng / Quét QR</span>
                    <span className="pill-desc">Xác nhận đơn tức thì với mọi ứng dụng ngân hàng</span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-glow-order">
              <ShieldCheck size={20} />
              <span>Xác nhận đặt hàng • {formatVND(totalPrice)}</span>
            </button>
          </form>
        </div>

        {/* Mini Preview Sidebar */}
        <aside className="checkout-summary-column">
          <div className="summary-glass-box">
            <h3 className="summary-title">Đơn hàng của bạn ({totalQuantity})</h3>

            <div className="checkout-mini-list">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="mini-item">
                  <div className="mini-img-wrap">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="mini-meta">
                    <span className="mini-title">{product.title}</span>
                    <span className="mini-qty">Số lượng: {quantity}</span>
                  </div>
                  <div className="mini-total">{formatVND(product.price * quantity)}</div>
                </div>
              ))}
            </div>

            <div className="summary-separator" />

            <div className="summary-line">
              <span>Tạm tính</span>
              <span>{formatVND(totalPrice)}</span>
            </div>
            <div className="summary-line">
              <span>Phí vận chuyển</span>
              <span className="free-badge">Miễn phí</span>
            </div>

            <div className="summary-line total-line">
              <span>Tổng thanh toán</span>
              <span className="final-price">{formatVND(totalPrice)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
