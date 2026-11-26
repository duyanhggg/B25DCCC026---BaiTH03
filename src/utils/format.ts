// Tỷ giá quy đổi giả định: 1 USD = 25,400 VNĐ
export const EXCHANGE_RATE_VND = 25400;

/**
 * Format giá từ USD sang định dạng tiền tệ VNĐ (ví dụ: 2.540.000 ₫)
 * @param priceInUsd Giá gốc từ API FakeStore (USD)
 */
export const formatVND = (priceInUsd: number): string => {
  const priceInVnd = Math.round(priceInUsd * EXCHANGE_RATE_VND);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(priceInVnd);
};
