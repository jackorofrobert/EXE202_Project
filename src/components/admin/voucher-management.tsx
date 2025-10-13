"use client"

import { useState, useEffect, useCallback } from "react"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { PlusIcon, EditIcon, TrashIcon, CopyIcon, CalendarIcon, UsersIcon, PercentIcon, DollarSignIcon } from "lucide-react"
import type { Voucher, VoucherStatus, VoucherType } from "../../types"

export default function VoucherManagement() {
  const { toast } = useToast()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage" as VoucherType,
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    status: "active" as VoucherStatus,
    validFrom: "",
    validTo: ""
  })

  const loadVouchers = useCallback(async () => {
    try {
      const vouchersData = await FirestoreService.getVouchers()
      setVouchers(vouchersData)
    } catch (error) {
      console.error("Error loading vouchers:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách voucher",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadVouchers()
  }, [loadVouchers])

  const handleCreateVoucher = async () => {
    try {
      if (!formData.code || !formData.name || !formData.validFrom || !formData.validTo) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin bắt buộc",
          variant: "destructive"
        })
        return
      }

      const voucherData = {
        ...formData,
        code: formData.code.toUpperCase(),
        createdBy: "admin" // In real app, get from auth context
      }

      await FirestoreService.createVoucher(voucherData)
      
      toast({
        title: "Thành công",
        description: "Tạo voucher thành công"
      })
      
      setIsDialogOpen(false)
      resetForm()
      loadVouchers()
    } catch (error) {
      console.error("Error creating voucher:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo voucher",
        variant: "destructive"
      })
    }
  }

  const handleUpdateVoucher = async () => {
    if (!editingVoucher) return

    try {
      await FirestoreService.updateVoucher(editingVoucher.id, {
        ...formData,
        code: formData.code.toUpperCase()
      })
      
      toast({
        title: "Thành công",
        description: "Cập nhật voucher thành công"
      })
      
      setIsDialogOpen(false)
      setEditingVoucher(null)
      resetForm()
      loadVouchers()
    } catch (error) {
      console.error("Error updating voucher:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật voucher",
        variant: "destructive"
      })
    }
  }

  const handleDeleteVoucher = async (voucherId: string) => {
    try {
      await FirestoreService.deleteVoucher(voucherId)
      
      toast({
        title: "Thành công",
        description: "Xóa voucher thành công"
      })
      
      loadVouchers()
    } catch (error) {
      console.error("Error deleting voucher:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa voucher",
        variant: "destructive"
      })
    }
  }

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      const newStatus = voucher.status === 'active' ? 'inactive' : 'active'
      await FirestoreService.updateVoucher(voucher.id, { status: newStatus })
      
      toast({
        title: "Thành công",
        description: `Voucher đã được ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'}`
      })
      
      loadVouchers()
    } catch (error) {
      console.error("Error updating voucher status:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái voucher",
        variant: "destructive"
      })
    }
  }

  const handleEditVoucher = (voucher: Voucher) => {
    setEditingVoucher(voucher)
    setFormData({
      code: voucher.code,
      name: voucher.name,
      description: voucher.description || "",
      type: voucher.type,
      value: voucher.value,
      minOrderAmount: voucher.minOrderAmount || 0,
      maxDiscountAmount: voucher.maxDiscountAmount || 0,
      usageLimit: voucher.usageLimit || 0,
      status: voucher.status,
      validFrom: voucher.validFrom.split('T')[0],
      validTo: voucher.validTo.split('T')[0]
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      status: "active",
      validFrom: "",
      validTo: ""
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Đã sao chép",
      description: "Mã voucher đã được sao chép vào clipboard"
    })
  }

  const getStatusBadge = (status: VoucherStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Tạm dừng</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Hết hạn</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeIcon = (type: VoucherType) => {
    return type === 'percentage' ? <PercentIcon className="h-4 w-4" /> : <DollarSignIcon className="h-4 w-4" />
  }

  const formatValue = (voucher: Voucher) => {
    if (voucher.type === 'percentage') {
      return `${voucher.value}%`
    } else {
      return `${voucher.value.toLocaleString('vi-VN')} VNĐ`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Voucher</h2>
          <p className="text-muted-foreground">Tạo và quản lý mã giảm giá</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingVoucher(null) }}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Tạo Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVoucher ? "Chỉnh sửa Voucher" : "Tạo Voucher Mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã Voucher *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Ví dụ: SUMMER2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Voucher *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Giảm giá mùa hè"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về voucher..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Loại giảm giá</Label>
                  <Select value={formData.type} onValueChange={(value: VoucherType) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed_amount">Số tiền cố định</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {formData.type === 'percentage' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VNĐ)'} *
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                    placeholder={formData.type === 'percentage' ? "10" : "50000"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">Đơn hàng tối thiểu (VNĐ)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscountAmount">Giảm tối đa (VNĐ)</Label>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    placeholder="0 = không giới hạn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value: VoucherStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Có hiệu lực từ *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo">Có hiệu lực đến *</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={editingVoucher ? handleUpdateVoucher : handleCreateVoucher}>
                  {editingVoucher ? "Cập nhật" : "Tạo"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả Voucher ({vouchers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Sử dụng</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {voucher.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(voucher.code)}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{voucher.name}</div>
                        {voucher.description && (
                          <div className="text-sm text-muted-foreground">
                            {voucher.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(voucher.type)}
                        <span className="text-sm">
                          {voucher.type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatValue(voucher)}</div>
                      {voucher.minOrderAmount && voucher.minOrderAmount > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Tối thiểu: {voucher.minOrderAmount.toLocaleString('vi-VN')} VNĐ
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(voucher.validFrom).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-muted-foreground">
                          đến {new Date(voucher.validTo).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-3 w-3" />
                        <span className="text-sm">
                          {voucher.usedCount}
                          {voucher.usageLimit ? `/${voucher.usageLimit}` : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVoucher(voucher)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(voucher)}
                        >
                          {voucher.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa voucher "{voucher.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteVoucher(voucher.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
