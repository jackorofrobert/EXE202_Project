"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { EyeIcon, CheckIcon, XIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon } from "lucide-react"
import type { Transaction, TransactionStatus, User } from "../../types"
import { Spinner } from "../../components/ui/spinner"

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userMap, setUserMap] = useState<Record<string, User>>({})
  const [adminNotes, setAdminNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [shouldShowImage, setShouldShowImage] = useState(false)
  const currentImageSrc = useRef<string | null>(null)
  const [activeTab, setActiveTab] = useState<TransactionStatus | "all">("pending")
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { toast } = useToast()

  const loadTransactions = useCallback(async () => {
    try {
      const data = await FirestoreService.getTransactions()
      setTransactions(data)
      
      // Load user information for all transactions
      const userIds = [...new Set(data.map(t => t.userId))]
      const userPromises = userIds.map(async (userId) => {
        try {
          const user = await FirestoreService.getUser(userId)
          return { userId, user }
        } catch (error) {
          console.error(`Error loading user ${userId}:`, error)
          return { userId, user: null }
        }
      })
      
      const userResults = await Promise.all(userPromises)
      const userMapData: Record<string, User> = {}
      userResults.forEach(({ userId, user }) => {
        if (user) {
          userMapData[userId] = user
        }
      })
      setUserMap(userMapData)
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
  }, [toast])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const getFilteredTransactions = () => {
    if (activeTab === "all") {
      return transactions
    }
    return transactions.filter(t => t.status === activeTab)
  }

  const getCurrentPageTransactions = () => {
    const filtered = getFilteredTransactions()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(getFilteredTransactions().length / itemsPerPage)

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

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    )
  }

  const handleViewTransaction = async (transaction: Transaction) => {
    // Reset image loaded state first
    setImageLoaded(false)
    setSelectedTransaction(transaction)
    setAdminNotes(transaction.adminNotes || "")
    
    // Update current image src ref
    currentImageSrc.current = transaction.paymentProof || null
    
    // Load user information
    try {
      const user = await FirestoreService.getUser(transaction.userId)
      setSelectedUser(user)
    } catch (error) {
      console.error("Error loading user:", error)
      setSelectedUser(null)
    }
  }
  
  // Reset image loaded when transaction changes
  useEffect(() => {
    if (selectedTransaction) {
      setImageLoaded(false)
      setShouldShowImage(false)
      currentImageSrc.current = selectedTransaction.paymentProof || null
      
      // Delay showing image element to ensure loading state is visible first
      if (selectedTransaction.paymentProof) {
        const timer = setTimeout(() => {
          setShouldShowImage(true)
        }, 50) // Small delay to ensure loading UI renders first
        
        return () => clearTimeout(timer)
      } else {
        setShouldShowImage(false)
      }
    } else {
      setImageLoaded(false)
      setShouldShowImage(false)
      currentImageSrc.current = null
    }
  }, [selectedTransaction?.id, selectedTransaction?.paymentProof])
  
  const handleImageLoad = () => {
    // Only set loaded if this is still the current image
    if (selectedTransaction?.paymentProof === currentImageSrc.current) {
      setImageLoaded(true)
    }
  }
  
  const handleImageError = () => {
    // Even if image fails to load, we should stop showing loading
    if (selectedTransaction?.paymentProof === currentImageSrc.current) {
      setImageLoaded(true)
    }
  }

  const handleSelectAll = () => {
    const currentPageTransactions = getCurrentPageTransactions()
    const allCurrentPageIds = currentPageTransactions.map(t => t.id)
    
    if (selectedTransactions.length === allCurrentPageIds.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(allCurrentPageIds)
    }
  }

  const handleBulkApprove = async () => {
    if (selectedTransactions.length === 0) return
    
    setIsProcessing(true)
    try {
      await Promise.all(
        selectedTransactions.map(id => 
          FirestoreService.updateTransactionStatus(id, "approved", adminNotes || undefined)
        )
      )
      
      toast({
        title: "Thành công",
        description: `Đã duyệt ${selectedTransactions.length} giao dịch`
      })
      
      setSelectedTransactions([])
      setAdminNotes("")
      loadTransactions()
    } catch (error) {
      console.error("Error bulk approving transactions:", error)
      toast({
        title: "Lỗi",
        description: "Không thể duyệt hàng loạt",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkReject = async () => {
    if (selectedTransactions.length === 0) return
    
    setIsProcessing(true)
    try {
      await Promise.all(
        selectedTransactions.map(id => 
          FirestoreService.updateTransactionStatus(id, "rejected", adminNotes || undefined)
        )
      )
      
      toast({
        title: "Thành công",
        description: `Đã từ chối ${selectedTransactions.length} giao dịch`
      })
      
      setSelectedTransactions([])
      setAdminNotes("")
      loadTransactions()
    } catch (error) {
      console.error("Error bulk rejecting transactions:", error)
      toast({
        title: "Lỗi",
        description: "Không thể từ chối hàng loạt",
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

  const getTypeText = (type: string, planType?: string) => {
    switch (type) {
      case "upgrade_to_gold":
        // Handle planType: yearly, monthly, or missing field (default to monthly)
        if (planType === 'yearly') {
          return 'Nâng cấp Gold (Hàng năm)'
        } else {
          // Monthly plan, missing planType field, or any other value (default to monthly)
          return 'Nâng cấp Gold (Hàng tháng)'
        }
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

      {/* Tabs and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Trạng thái:</Label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => { setActiveTab("pending"); setCurrentPage(1); setSelectedTransactions([]) }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "pending"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Chờ duyệt ({transactions.filter(t => t.status === "pending").length})
                  </button>
                  <button
                    onClick={() => { setActiveTab("approved"); setCurrentPage(1); setSelectedTransactions([]) }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "approved"
                        ? "bg-white text-green-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <CheckIcon className="h-4 w-4 inline mr-1" />
                    Đã duyệt ({transactions.filter(t => t.status === "approved").length})
                  </button>
                  <button
                    onClick={() => { setActiveTab("rejected"); setCurrentPage(1); setSelectedTransactions([]) }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "rejected"
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <XIcon className="h-4 w-4 inline mr-1" />
                    Từ chối ({transactions.filter(t => t.status === "rejected").length})
                  </button>
                </div>
              </div>
            </div>
            
            {selectedTransactions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedTransactions.length} giao dịch
                </span>
                <Button
                  onClick={handleBulkApprove}
                  disabled={isProcessing}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Duyệt tất cả
                </Button>
                <Button
                  onClick={handleBulkReject}
                  disabled={isProcessing}
                  variant="destructive"
                  size="sm"
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Từ chối tất cả
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách giao dịch ({getFilteredTransactions().length})</CardTitle>
                {getFilteredTransactions().length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedTransactions.length === getCurrentPageTransactions().length && getCurrentPageTransactions().length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label className="text-sm">Chọn tất cả</Label>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getFilteredTransactions().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Không có giao dịch nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getCurrentPageTransactions().map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedTransactions.includes(transaction.id) ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedTransactions.includes(transaction.id)}
                            onCheckedChange={() => handleSelectTransaction(transaction.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <h3 className="font-semibold">{getTypeText(transaction.type, transaction.planType)}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <UserIcon className="h-3 w-3" />
                              <span>{userMap[transaction.userId]?.name || 'Đang tải...'}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {transaction.amount.toLocaleString('vi-VN')} VND
                              {transaction.originalAmount && transaction.originalAmount !== transaction.amount && (
                                <span className="text-green-600 ml-2">
                                  (Giảm {transaction.discountAmount?.toLocaleString('vi-VN')} VND)
                                </span>
                              )}
                            </p>
                            {transaction.voucherCode && (
                              <p className="text-xs text-blue-600">
                                Voucher: {transaction.voucherCode}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, getFilteredTransactions().length)} 
                    trong tổng số {getFilteredTransactions().length} giao dịch
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
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
                  <p>{getTypeText(selectedTransaction.type, selectedTransaction.planType)}</p>
                </div>

                {selectedUser && (
                  <div>
                    <Label className="text-sm font-medium">Người dùng</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{selectedUser.name}</p>
                        <p className="text-sm text-gray-600">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Số tiền</Label>
                  <p className="font-semibold">{selectedTransaction.amount.toLocaleString('vi-VN')} VND</p>
                  {selectedTransaction.originalAmount && selectedTransaction.originalAmount !== selectedTransaction.amount && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        Giá gốc: {selectedTransaction.originalAmount.toLocaleString('vi-VN')} VND
                      </p>
                      <p className="text-sm text-green-600">
                        Giảm giá: {selectedTransaction.discountAmount?.toLocaleString('vi-VN')} VND
                      </p>
                    </div>
                  )}
                </div>

                {selectedTransaction.voucherCode && (
                  <div>
                    <Label className="text-sm font-medium">Mã voucher</Label>
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                      {selectedTransaction.voucherCode}
                    </p>
                  </div>
                )}

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
                    <div className="mt-2 relative min-h-[192px]">
                      {!imageLoaded && (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg border absolute inset-0 z-10">
                          <div className="text-center">
                            <Spinner className="h-6 w-6 text-primary mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Đang tải ảnh...</p>
                          </div>
                        </div>
                      )}
                      {selectedTransaction.paymentProof && shouldShowImage && (
                        <img
                          key={`img-${selectedTransaction.id}`}
                          src={selectedTransaction.paymentProof}
                          alt="Payment proof"
                          className={`w-full h-48 object-cover rounded-lg border ${!imageLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      )}
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
