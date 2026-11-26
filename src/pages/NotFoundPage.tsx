import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="state-container not-found-container">
      <AlertTriangle size={70} className="not-found-icon" />
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
      <Link to="/" className="btn btn-primary btn-lg">
        <Home size={18} /> Về Trang chủ
      </Link>
    </div>
  );
};
