import React, { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productsSlice';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Trích xuất danh mục động
  const categories = useMemo(() => {
    const list = Array.from(new Set(items.map((i) => i.category)));
    return ['all', ...list];
  }, [items]);

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let result = [...items];

    // Lọc theo search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((p) => p.title.toLowerCase().includes(term));
    }

    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sắp xếp
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    return result;
  }, [items, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="home-experience">
      {/* Hero Showcase Banner */}
      <section className="hero-showcase">
        <div className="hero-pill-badge">
          <Sparkles size={14} />
          <span>Phiên bản đặc biệt • Thiết kế độc bản</span>
        </div>
        <h1 className="hero-title">
          Bộ sưu tập tinh hoa <br />
          <span className="text-gradient">Định hình phong cách sống</span>
        </h1>
        <p className="hero-subtitle">
          Trải nghiệm mua sắm hiện đại với hiệu năng mượt mà từ React, Redux Toolkit và Context API.
        </p>

        {/* Dynamic Search Box */}
        <div className="hero-search-wrapper">
          <div className="hero-search-box">
            <Search className="search-icon" size={19} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm, bộ sưu tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hero-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Sort Toolbar */}
      <section className="toolbar-section">
        <div className="category-scroll-container">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

        <div className="sort-dropdown-wrapper">
          <ArrowUpDown size={15} className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="sort-select"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </section>

      {/* Product Display Area */}
      <section className="products-container">
        {status === 'loading' && (
          <div className="skeleton-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="skeleton-card">
                <div className="skeleton-image shimmer" />
                <div className="skeleton-line shimmer short" />
                <div className="skeleton-line shimmer" />
                <div className="skeleton-footer shimmer" />
              </div>
            ))}
          </div>
        )}

        {status === 'failed' && (
          <div className="state-empty-box error">
            <h3>Không thể tải dữ liệu</h3>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => dispatch(fetchProducts())}
              className="btn-glow-primary"
            >
              Thử tải lại
            </button>
          </div>
        )}

        {status === 'succeeded' && (
          <>
            <div className="results-indicator">
              <span>Đang hiển thị <strong>{filteredProducts.length}</strong> sản phẩm</span>
              {(selectedCategory !== 'all' || searchTerm) && (
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="state-empty-box">
                <SlidersHorizontal size={48} className="empty-icon" />
                <h3>Không tìm thấy sản phẩm phù hợp</h3>
                <p>Hãy thử tìm bằng từ khóa khác hoặc bỏ chọn các danh mục đang lọc.</p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
