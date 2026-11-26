import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import type { Product } from '../types';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { formatVND } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    showToast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng',
      message: product.title,
    });
  };

  return (
    <div className="signature-card">
      <Link to={`/products/${product.id}`} className="card-media-link">
        <div className="card-badge-category">{product.category}</div>
        <div className="card-image-container">
          <img 
            src={product.image} 
            alt={product.title} 
            className="card-product-img" 
            loading="lazy" 
          />
        </div>
      </Link>

      <div className="card-body">
        <div className="card-rating">
          <Star size={13} className="star-icon" fill="currentColor" />
          <span>{product.rating?.rate || '4.5'}</span>
          <span className="rating-count">({product.rating?.count || 120})</span>
        </div>

        <Link to={`/products/${product.id}`} className="card-title-link">
          <h3 className="card-title" title={product.title}>
            {product.title}
          </h3>
        </Link>

        <div className="card-footer-action">
          <div className="card-price">
            <span className="price-amount">{formatVND(product.price)}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-quick-add"
            title="Thêm nhanh vào giỏ"
          >
            <Plus size={16} />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
