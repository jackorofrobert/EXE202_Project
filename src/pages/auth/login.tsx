"use client";

import type React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import Logo from "../../components/ui/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email, password);

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "psychologist") {
        navigate("/psychologist");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      // Handle Firebase auth errors with user-friendly messages
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
      
      if (err?.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = "Không tìm thấy tài khoản với email này.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Mật khẩu không đúng.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Email không hợp lệ.";
            break;
          case 'auth/user-disabled':
            errorMessage = "Tài khoản đã bị vô hiệu hóa.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
            break;
          default:
            errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-center items-center mb-8 cursor-pointer" onClick={handleLogoClick}>
            <Logo size="lg" clickable={false} iconOnly={true} className="scale-150" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Đăng nhập</h2>
          <p className="text-center text-gray-600 mb-8">
            Chào mừng trở lại EmoCare
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2 text-gray-700"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
