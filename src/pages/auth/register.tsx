"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import Logo from "../../components/ui/logo"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, name)
      navigate("/dashboard")
    } catch (err: any) {
      // Handle Firebase auth errors with user-friendly messages
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
      
      if (err?.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Email này đã được sử dụng. Vui lòng chọn email khác.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Email không hợp lệ.";
            break;
          case 'auth/weak-password':
            errorMessage = "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.";
            break;
          case 'auth/operation-not-allowed':
            errorMessage = "Tính năng đăng ký tạm thời không khả dụng.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Quá nhiều lần thử đăng ký. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage = "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-center items-center mb-8 cursor-pointer" onClick={handleLogoClick}>
            <Logo size="lg" clickable={false} iconOnly={true} className="scale-150" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Đăng ký</h2>
          <p className="text-center text-gray-600 mb-8">Tạo tài khoản EmoCare mới</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-gray-700">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
