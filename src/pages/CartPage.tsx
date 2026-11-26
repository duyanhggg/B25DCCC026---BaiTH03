import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectCartItems,
  selectTotalPrice,
  selectTotalQuantity,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../features/cart/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { formatVND } from '../utils/format';

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const totalPrice = useAppSelector(selectTotalPrice);

  const handleClearCart = () => {
    dispatch(clearCart());
    showToast({
      type: 'info',
      title: 'Đã xóa toàn bộ giỏ hàng',
    });
  };

  const handleRemoveItem = (id: number, title: string) => {
    dispatch(removeFromCart(id));
    showToast({
      type: 'info',
      title: 'Đã xóa sản phẩm',
      message: title,
    });
  };

  if (items.length === 0) {
    return (
      <div className="state-empty-box">
        <div className="empty-bubble-icon">
          <ShoppingBag size={48} />
        </div>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Khám phá bộ sưu tập sản phẩm độc bản và chọn món đồ bạn yêu thích nhất.</p>
        <Link to="/" className="btn-glow-primary">
          <Sparkles size={16} /> Bắt đầu mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-experience">
      <div className="cart-top-bar">
        <div>
          <h1 className="cart-headline">Giỏ hàng của bạn</h1>
          <span className="cart-subline">{totalQuantity} món hàng được chọn lọc</span>
        </div>
        <button
          type="button"
          onClick={handleClearCart}
          className="btn-text-danger"
        >
          <Trash2 size={15} /> Làm trống giỏ hàng
        </button>
      </div>

      <div className="cart-two-column-layout">
        {/* Items List */}
        <div className="cart-products-column">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="cart-card-item">
              <div className="cart-img-box">
                <img src={product.image} alt={product.title} />
              </div>

              <div className="cart-item-meta">
                <span className="cart-item-category">{product.category}</span>
                <Link to={`/products/${product.id}`} className="cart-item-title-link">
                  {product.title}
                </Link>
                <div className="cart-unit-price">{formatVND(product.price)} / món</div>
              </div>

              {/* Quantity Stepper */}
              <div className="stepper-widget">
                <button
                  type="button"
                  onClick={() =>
                    dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }))
                  }
                  className="stepper-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="stepper-value">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }))
                  }
                  className="stepper-btn"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="cart-line-total">
                {formatVND(product.price * quantity)}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(product.id, product.title)}
                className="cart-delete-trigger"
                title="Xóa món này"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="cart-sidebar-column">
          <div className="summary-glass-box">
            <h3 className="summary-title">Tóm tắt đơn hàng</h3>

            <div className="summary-line">
              <span>Tổng số lượng</span>
              <span className="summary-val">{totalQuantity} sản phẩm</span>
            </div>
            <div className="summary-line">
              <span>Tạm tính</span>
              <span className="summary-val">{formatVND(totalPrice)}</span>
            </div>
            <div className="summary-line">
              <span>Phí vận chuyển</span>
              <span className="summary-val free-badge">Miễn phí 100%</span>
            </div>

            <div className="summary-separator" />

            <div className="summary-line total-line">
              <span>Tổng thanh toán</span>
              <span className="final-price">{formatVND(totalPrice)}</span>
            </div>

            <Link to="/checkout" className="btn-glow-checkout">
              <span>Tiến hành thanh toán</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/" className="back-shopping-link">
              ← Tiếp tục xem sản phẩm khác
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};
