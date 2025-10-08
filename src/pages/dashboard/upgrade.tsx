"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";

export default function UpgradePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would call a payment API
    // For now, we'll just show success
    alert("Nâng cấp thành công! Vui lòng đăng nhập lại để cập nhật tài khoản.");
    setIsProcessing(false);
    navigate("/dashboard");
  };

  if (user?.tier === "gold") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Nâng cấp tài khoản</h2>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-semibold mb-2">
            Bạn đã là thành viên Gold!
          </h3>
          <p className="text-muted-foreground">
            Bạn đang sử dụng đầy đủ tính năng của EmoCare
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nâng cấp lên Gold</h2>
        <p className="text-muted-foreground">
          Trải nghiệm đầy đủ tính năng chăm sóc sức khỏe tâm lý
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <div className="text-3xl font-bold">0đ</div>
            <p className="text-sm text-muted-foreground">Miễn phí mãi mãi</p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Theo dõi cảm xúc hàng ngày</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Xem biểu đồ thống kê cơ bản</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Gợi ý hoạt động giảm stress</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Viết nhật ký cá nhân</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">✗</span>
              <span className="text-muted-foreground">Chatbot AI tư vấn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">✗</span>
              <span className="text-muted-foreground">
                Đặt lịch bác sĩ tâm lý
              </span>
            </li>
          </ul>
        </div>

        {/* Gold Plan */}
        <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg border-2 border-accent p-6 space-y-4 relative">
          <div className="absolute -top-3 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Phổ biến nhất
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Gold</h3>
            <div className="text-3xl font-bold">299.000đ</div>
            <p className="text-sm text-muted-foreground">Mỗi tháng</p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="font-medium">Tất cả tính năng Free</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Chatbot AI tư vấn 24/7</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Đặt lịch với bác sĩ tâm lý</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Chat trực tiếp với bác sĩ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Phân tích cảm xúc chi tiết</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Hỗ trợ ưu tiên</span>
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isProcessing ? "Đang xử lý..." : "Nâng cấp ngay"}
          </button>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h4 className="font-semibold mb-3">Câu hỏi thường gặp</h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium mb-1">
              Tôi có thể hủy bất cứ lúc nào không?
            </p>
            <p className="text-muted-foreground">
              Có, bạn có thể hủy đăng ký bất cứ lúc nào. Bạn vẫn có thể sử dụng
              tính năng Gold cho đến hết chu kỳ thanh toán.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">
              Phương thức thanh toán nào được chấp nhận?
            </p>
            <p className="text-muted-foreground">
              Chúng tôi chấp nhận thẻ tín dụng, thẻ ghi nợ, và ví điện tử (Momo,
              ZaloPay, VNPay).
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">
              Dữ liệu của tôi có được bảo mật không?
            </p>
            <p className="text-muted-foreground">
              Tất cả dữ liệu của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi
              tuân thủ các tiêu chuẩn bảo mật cao nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
