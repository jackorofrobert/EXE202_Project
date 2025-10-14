"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import FileUpload from "../../components/ui/file-upload"
import { FirestoreService } from "../../lib/firestore-service"
import { useAuth } from "../../contexts/auth-context"
import { useToast } from "../../hooks/use-toast"
import { ArrowLeftIcon, CreditCardIcon, CheckIcon, TagIcon, XIcon } from "lucide-react"
import type { Voucher } from "../../types"

export default function PaymentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [paymentProof, setPaymentProof] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voucherCode, setVoucherCode] = useState("")
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false)

  const upgradePrice = 59000 // 59k VND per month
  const yearlyPrice = 599000 // 599k VND per year
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  const currentPrice = selectedPlan === 'monthly' ? upgradePrice : yearlyPrice
  const finalPrice = Math.max(0, currentPrice - discountAmount)

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã voucher",
        variant: "destructive"
      })
      return
    }

    setIsValidatingVoucher(true)
    try {
      const validation = await FirestoreService.validateVoucher(voucherCode, currentPrice)
      
      if (validation.isValid && validation.voucher && validation.discountAmount) {
        setAppliedVoucher(validation.voucher)
        setDiscountAmount(validation.discountAmount)
        toast({
          title: "Thành công",
          description: `Áp dụng voucher thành công! Giảm ${validation.discountAmount.toLocaleString('vi-VN')} VNĐ`
        })
      } else {
        toast({
          title: "Lỗi",
          description: validation.error || "Mã voucher không hợp lệ",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error validating voucher:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi kiểm tra voucher",
        variant: "destructive"
      })
    } finally {
      setIsValidatingVoucher(false)
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    setDiscountAmount(0)
    setVoucherCode("")
    toast({
      title: "Đã hủy",
      description: "Voucher đã được gỡ bỏ"
    })
  }

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
      const transactionData: any = {
        userId: user.id,
        type: "upgrade_to_gold" as const,
        amount: finalPrice,
        status: "pending" as const,
        paymentProof: paymentProof,
        planType: selectedPlan,
        originalAmount: currentPrice
      }

      // Only add voucher-related fields if voucher was applied
      if (appliedVoucher && discountAmount > 0) {
        transactionData.discountAmount = discountAmount
        transactionData.voucherCode = appliedVoucher.code
      }

      await FirestoreService.createTransaction(transactionData)

      // If voucher was used, record the usage
      if (appliedVoucher) {
        // We'll need to get the transaction ID after creation
        // For now, we'll handle this in the transaction creation
      }

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
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Chọn gói:</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('monthly')}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedPlan === 'monthly'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">Hàng tháng</div>
                        <div className="text-sm text-gray-600">59.000đ/tháng</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('yearly')}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedPlan === 'yearly'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">Hàng năm</div>
                        <div className="text-sm text-gray-600">599.000đ/năm</div>
                        <div className="text-xs text-green-600 font-medium">Tiết kiệm 109.000đ</div>
                      </button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Voucher Section */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Mã giảm giá:</Label>
                  {!appliedVoucher ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã voucher"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyVoucher}
                        disabled={isValidatingVoucher || !voucherCode.trim()}
                        variant="outline"
                      >
                        {isValidatingVoucher ? "Đang kiểm tra..." : "Áp dụng"}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TagIcon className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">{appliedVoucher.code}</span>
                          <Badge variant="secondary" className="text-xs">
                            {appliedVoucher.type === 'percentage' 
                              ? `${appliedVoucher.value}%` 
                              : `${appliedVoucher.value.toLocaleString('vi-VN')} VNĐ`
                            }
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveVoucher}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        Giảm {discountAmount.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                  )}
                </div>

                <Separator />
                
                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span className="font-medium">
                      {currentPrice.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Giảm giá:</span>
                      <span className="font-medium">
                        -{discountAmount.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">Tổng cộng:</span>
                    <span className="font-bold text-lg text-primary">
                      {finalPrice.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Quét mã QR để thanh toán</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Sử dụng ứng dụng ngân hàng để quét mã QR và chuyển khoản
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src="/qr_payment.jpg" 
                      alt="QR Payment" 
                      className="w-48 h-48 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Lưu ý quan trọng:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Chuyển khoản chính xác số tiền: {finalPrice.toLocaleString('vi-VN')} VND</li>
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
