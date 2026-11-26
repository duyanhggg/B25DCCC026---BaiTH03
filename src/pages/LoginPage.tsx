import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy đường dẫn trước đó được lưu từ ProtectedRoute (hoặc mặc định về '/')
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // Nếu đã đăng nhập, chuyển hướng ngay
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Đăng nhập không thành công');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng nhập ShopMini</h2>
          <p>Nhập thông tin tài khoản để tiếp tục thanh toán và quản lý đơn hàng</p>
        </div>

        <div className="auth-note">
          <p>
            💡 <strong>Tài khoản thử nghiệm:</strong> Mật khẩu: <code>123456</code> (Tên đăng nhập tuỳ chọn)
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="input-wrapper">
              <UserIcon size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập (vd: vuduyanh)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Mật khẩu là: 123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};
