import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star, ShieldCheck, Check, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { formatVND } from '../utils/format';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const reduxProducts = useAppSelector((state) => state.products.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const existing = reduxProducts.find((p) => p.id === Number(id));
    if (existing) {
      setProduct(existing);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, reduxProducts]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      setAdded(true);
      showToast({
        type: 'success',
        title: 'Đã thêm vào giỏ',
        message: `${product.title} đã sẵn sàng trong giỏ hàng!`,
      });
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading-box">
        <div className="detail-skeleton-grid">
          <div className="skeleton-img-box shimmer" />
          <div className="skeleton-text-box">
            <div className="skeleton-line shimmer short" />
            <div className="skeleton-line shimmer title" />
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-empty-box error">
        <h3>Lỗi tải sản phẩm</h3>
        <p>{error || 'Sản phẩm không tồn tại trong hệ thống'}</p>
        <Link to="/" className="btn-glow-primary">
          <ArrowLeft size={16} /> Quay về Trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-experience">
      <Link to="/" className="nav-back-button">
        <ArrowLeft size={16} />
        <span>Trở về danh sách sản phẩm</span>
      </Link>

      <div className="detail-glass-card">
        {/* Media Column */}
        <div className="detail-visual-column">
          <div className="detail-image-frame">
            <img src={product.image} alt={product.title} className="detail-hero-img" />
          </div>
          <div className="detail-authenticity-tag">
            <ShieldCheck size={16} />
            <span>Sản phẩm chính hãng có bảo hiểm chất lượng</span>
          </div>
        </div>

        {/* Info Column */}
        <div className="detail-content-column">
          <div className="detail-header-badges">
            <span className="detail-category-badge">{product.category}</span>
            <div className="detail-rating-pill">
              <Star size={14} className="star-fill" />
              <span>{product.rating?.rate || '4.8'}</span>
              <span className="rating-votes">({product.rating?.count || 120} đánh giá)</span>
            </div>
          </div>

          <h1 className="detail-item-title">{product.title}</h1>

          <div className="detail-pricing-block">
            <span className="price-tag">{formatVND(product.price)}</span>
            <span className="vat-tag">Đã bao gồm thuế GTGT & miễn phí vận chuyển toàn quốc</span>
          </div>

          <div className="detail-description-section">
            <h4>Mô tả chi tiết</h4>
            <p>{product.description}</p>
          </div>

          <div className="detail-highlights">
            <div className="highlight-item">
              <Sparkles size={16} /> Thiết kế hiện đại, gia công tỉ mỉ
            </div>
            <div className="highlight-item">
              <Sparkles size={16} /> Đóng gói theo tiêu chuẩn cao cấp
            </div>
          </div>

          <div className="detail-cta-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`btn-detail-add ${added ? 'btn-detail-added' : ''}`}
            >
              {added ? (
                <>
                  <Check size={20} />
                  <span>Đã thêm vào giỏ!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  <span>Thêm vào giỏ hàng</span>
                </>
              )}
            </button>
            <Link to="/cart" className="btn-detail-cart">
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
