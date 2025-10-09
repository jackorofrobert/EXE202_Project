"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import FileUpload from "../../components/ui/file-upload"
import { FirestoreService } from "../../lib/firestore-service"
import { useAuth } from "../../contexts/auth-context"
import { useToast } from "../../hooks/use-toast"
import { ArrowLeftIcon, CreditCardIcon, CheckIcon } from "lucide-react"
import type { Transaction } from "../../types"

export default function PaymentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [paymentProof, setPaymentProof] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const upgradePrice = 299000 // 299k VND

  const handleSubmitTransaction = async () => {
    if (!paymentProof) {
      toast({
        title: "Lỗi",
        description: "Vui lòng upload ảnh chứng minh thanh toán",
        variant: "destructive"
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await FirestoreService.createTransaction({
        userId: user.id,
        type: "upgrade_to_gold",
        amount: upgradePrice,
        status: "pending",
        paymentProof: paymentProof
      })

      toast({
        title: "Thành công",
        description: "Giao dịch đã được gửi và đang chờ duyệt"
      })

      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating transaction:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo giao dịch",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/upgrade")}
            className="mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán nâng cấp Gold</h1>
          <p className="text-gray-600 mt-2">Hoàn tất thanh toán để nâng cấp tài khoản</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gói dịch vụ:</span>
                  <Badge variant="secondary">Gold Member</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá:</span>
                  <span className="font-semibold text-lg">{upgradePrice.toLocaleString('vi-VN')} VND</span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Quét mã QR để thanh toán</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Sử dụng ứng dụng ngân hàng để quét mã QR và chuyển khoản
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src="/qr_payment.jpeg" 
                      alt="QR Payment" 
                      className="w-48 h-48 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Lưu ý quan trọng:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Chuyển khoản chính xác số tiền: {upgradePrice.toLocaleString('vi-VN')} VND</li>
                    <li>• Nội dung chuyển khoản: "UPGRADE {user?.email}"</li>
                    <li>• Sau khi chuyển khoản, hãy upload ảnh chứng minh</li>
                    <li>• Giao dịch sẽ được duyệt trong vòng 24h</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Xác nhận thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onUpload={setPaymentProof}
                  accept="image/*"
                  maxSize={5}
                  className="mb-6"
                />

                <Button
                  onClick={handleSubmitTransaction}
                  disabled={!paymentProof || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Đang xử lý..." : "Hoàn thành thanh toán"}
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Bằng cách nhấn "Hoàn thành thanh toán", bạn đồng ý với các điều khoản sử dụng
                </p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Quyền lợi Gold Member</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                    Truy cập đầy đủ tính năng chatbot AI
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                    Đặt lịch tư vấn với bác sĩ tâm lý
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                    Hỗ trợ ưu tiên 24/7
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                    Báo cáo chi tiết về sức khỏe tâm lý
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                    Không giới hạn số lượng nhật ký
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
