"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword === currentPassword) {
      setError("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setIsLoading(true);

    try {
      // First, we need to re-authenticate the user with current password
      // This is required by Firebase for security
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("../../lib/firebase/config");
      
      if (!user?.email) {
        throw new Error("Không tìm thấy thông tin email");
      }

      // Re-authenticate with current password
      await signInWithEmailAndPassword(auth, user.email, currentPassword);
      
      // Now change the password
      await changePassword(newPassword);
      
      setSuccess("Mật khẩu đã được thay đổi thành công!");
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (err: any) {
      let errorMessage = "Thay đổi mật khẩu thất bại. Vui lòng thử lại.";
      
      if (err?.code) {
        switch (err.code) {
          case 'auth/wrong-password':
            errorMessage = "Mật khẩu hiện tại không đúng.";
            break;
          case 'auth/weak-password':
            errorMessage = "Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn.";
            break;
          case 'auth/requires-recent-login':
            errorMessage = "Vui lòng đăng nhập lại để thay đổi mật khẩu.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
            break;
          default:
            errorMessage = "Thay đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Thay đổi mật khẩu
            </CardTitle>
            <CardDescription className="text-gray-600">
              Nhập mật khẩu hiện tại và mật khẩu mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang thay đổi..." : "Thay đổi mật khẩu"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
