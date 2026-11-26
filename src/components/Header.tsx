import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useAppSelector } from '../app/hooks';
import { selectTotalQuantity } from '../features/cart/cartSlice';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast({
      type: 'info',
      title: 'Đã đăng xuất',
      message: 'Hẹn gặp lại bạn lần sau!',
    });
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon-wrapper">
            <Sparkles className="brand-icon" size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-name">AuraStore</span>
            <span className="brand-tagline">Signature Edition</span>
          </div>
        </Link>

        <div className="nav-actions">
          {/* Nút đổi Theme sáng/tối với icon animation */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="theme-toggle-btn" 
            title={theme === 'light' ? 'Bật giao diện đêm' : 'Bật giao diện ngày'}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            <span className="theme-toggle-text">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          {/* Giỏ hàng phong cách tối giản sang trọng */}
          <Link to="/cart" className="cart-chip" title="Xem giỏ hàng">
            <ShoppingBag size={18} />
            <span className="cart-chip-label">Giỏ hàng</span>
            <span className={`cart-chip-count ${totalQuantity > 0 ? 'has-items' : ''}`}>
              {totalQuantity}
            </span>
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div className="user-profile-menu">
              <div className="user-avatar-pill">
                <span className="avatar-letter">{user.username.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.username}</span>
              </div>
              <button 
                type="button" 
                onClick={handleLogout} 
                className="btn-ghost-logout"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-glow-primary">
              <LogIn size={16} />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
