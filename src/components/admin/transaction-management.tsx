"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { EyeIcon, CheckIcon, XIcon, ClockIcon } from "lucide-react"
import type { Transaction, TransactionStatus } from "../../types"

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const data = await FirestoreService.getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error("Error loading transactions:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách giao dịch",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (transaction: Transaction) => {
    setIsProcessing(true)
    try {
      await FirestoreService.updateTransactionStatus(
        transaction.id, 
        "approved", 
        adminNotes || undefined
      )
      
      toast({
        title: "Thành công",
        description: "Giao dịch đã được duyệt"
      })
      
      setSelectedTransaction(null)
      setAdminNotes("")
      loadTransactions()
    } catch (error) {
      console.error("Error approving transaction:", error)
      toast({
        title: "Lỗi",
        description: "Không thể duyệt giao dịch",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (transaction: Transaction) => {
    setIsProcessing(true)
    try {
      await FirestoreService.updateTransactionStatus(
        transaction.id, 
        "rejected", 
        adminNotes || undefined
      )
      
      toast({
        title: "Thành công",
        description: "Giao dịch đã bị từ chối"
      })
      
      setSelectedTransaction(null)
      setAdminNotes("")
      loadTransactions()
    } catch (error) {
      console.error("Error rejecting transaction:", error)
      toast({
        title: "Lỗi",
        description: "Không thể từ chối giao dịch",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><ClockIcon className="h-3 w-3 mr-1" />Chờ duyệt</Badge>
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckIcon className="h-3 w-3 mr-1" />Đã duyệt</Badge>
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XIcon className="h-3 w-3 mr-1" />Từ chối</Badge>
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "upgrade_to_gold":
        return "Nâng cấp Gold"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quản lý giao dịch</h2>
        <p className="text-gray-600">Duyệt và quản lý các giao dịch nâng cấp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có giao dịch nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{getTypeText(transaction.type)}</h3>
                          <p className="text-sm text-gray-600">
                            {transaction.amount.toLocaleString('vi-VN')} VND
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(transaction.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTransaction(transaction)
                            }}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transaction Details */}
        <div>
          {selectedTransaction ? (
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Loại giao dịch</Label>
                  <p>{getTypeText(selectedTransaction.type)}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Số tiền</Label>
                  <p className="font-semibold">{selectedTransaction.amount.toLocaleString('vi-VN')} VND</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Ngày tạo</Label>
                  <p>{new Date(selectedTransaction.createdAt).toLocaleString('vi-VN')}</p>
                </div>

                {selectedTransaction.paymentProof && (
                  <div>
                    <Label className="text-sm font-medium">Ảnh chứng minh</Label>
                    <div className="mt-2">
                      <img
                        src={selectedTransaction.paymentProof}
                        alt="Payment proof"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                )}

                {selectedTransaction.adminNotes && (
                  <div>
                    <Label className="text-sm font-medium">Ghi chú admin</Label>
                    <p className="text-sm text-gray-600">{selectedTransaction.adminNotes}</p>
                  </div>
                )}

                {selectedTransaction.status === "pending" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="adminNotes">Ghi chú</Label>
                      <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Nhập ghi chú (tùy chọn)"
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(selectedTransaction)}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Duyệt
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedTransaction)}
                        disabled={isProcessing}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        Từ chối
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                <p>Chọn một giao dịch để xem chi tiết</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
