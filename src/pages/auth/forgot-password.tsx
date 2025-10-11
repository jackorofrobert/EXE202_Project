"use client";

import type React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import Logo from "../../components/ui/logo";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      // Handle Firebase auth errors with user-friendly messages
      let errorMessage = "Gửi email reset mật khẩu thất bại. Vui lòng thử lại.";
      
      if (err?.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = "Không tìm thấy tài khoản với email này.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Email không hợp lệ.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
            break;
          default:
            errorMessage = "Gửi email reset mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div onClick={handleLogoClick} className="cursor-pointer inline-block">
              <Logo />
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Email đã được gửi
              </CardTitle>
              <CardDescription className="text-gray-600">
                Chúng tôi đã gửi link reset mật khẩu đến email của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng kiểm tra hộp thư email của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
                </AlertDescription>
              </Alert>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Không nhận được email? Kiểm tra thư mục spam hoặc thử lại.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Gửi lại email
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng nhập
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div onClick={handleLogoClick} className="cursor-pointer inline-block">
            <Logo />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quên mật khẩu?
            </CardTitle>
            <CardDescription className="text-gray-600">
              Nhập email của bạn để nhận link reset mật khẩu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang gửi..." : "Gửi link reset mật khẩu"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu?{" "}
                <Link
                  to="/login"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
