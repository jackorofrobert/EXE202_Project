"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Star, Search, Filter, Calendar, UserIcon, MessageSquare, TrendingUp, TrendingDown } from "lucide-react"
import type { Booking, User } from "../../types"

export default function PsychologistRatingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [ratings, setRatings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const loadData = useCallback(async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const [bookingsData, usersData] = await Promise.all([
        FirestoreService.getBookingsForPsychologist(user.id),
        FirestoreService.getAllUsers()
      ])
      
      // Filter only completed bookings with ratings
      const ratedBookings = bookingsData.filter(booking => 
        booking.status === 'completed' && booking.rating
      )
      
      setRatings(ratedBookings)
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading ratings data:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu đánh giá",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Filter ratings based on current filters
  const filteredRatings = ratings.filter(rating => {
    const user = users.find(u => u.id === rating.userId)
    
    // Search filter
    const matchesSearch = searchTerm === "" || 
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.ratingComment?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Rating filter
    const matchesRating = ratingFilter === "all" || 
      (ratingFilter === "5" && rating.rating === 5) ||
      (ratingFilter === "4" && rating.rating === 4) ||
      (ratingFilter === "3" && rating.rating === 3) ||
      (ratingFilter === "2" && rating.rating === 2) ||
      (ratingFilter === "1" && rating.rating === 1)
    
    // Date filter
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "today" && new Date(rating.ratedAt || "").toDateString() === new Date().toDateString()) ||
      (dateFilter === "week" && new Date(rating.ratedAt || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === "month" && new Date(rating.ratedAt || "").getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesRating && matchesDate
  })

  // Calculate statistics
  const totalRatings = ratings.length
  const averageRating = totalRatings > 0 ? 
    ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0) / totalRatings : 0
  
  const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
    star,
    count: ratings.filter(r => r.rating === star).length,
    percentage: totalRatings > 0 ? (ratings.filter(r => r.rating === star).length / totalRatings) * 100 : 0
  }))

  // Calculate trends (compare last 30 days with previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  
  const recentRatings = ratings.filter(r => 
    r.ratedAt && new Date(r.ratedAt) >= thirtyDaysAgo
  )
  const previousRatings = ratings.filter(r => 
    r.ratedAt && new Date(r.ratedAt) >= sixtyDaysAgo && new Date(r.ratedAt) < thirtyDaysAgo
  )
  
  const recentAverage = recentRatings.length > 0 ? 
    recentRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / recentRatings.length : 0
  const previousAverage = previousRatings.length > 0 ? 
    previousRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / previousRatings.length : 0
  
  const ratingTrend = recentAverage - previousAverage

  const getRatingBadge = (rating: number) => {
    const colors = {
      5: "bg-green-100 text-green-800",
      4: "bg-blue-100 text-blue-800", 
      3: "bg-yellow-100 text-yellow-800",
      2: "bg-orange-100 text-orange-800",
      1: "bg-red-100 text-red-800"
    }
    return (
      <Badge className={colors[rating as keyof typeof colors]}>
        {rating} sao
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Đánh giá của tôi</h2>
        <p className="text-muted-foreground">Theo dõi phản hồi từ bệnh nhân</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng đánh giá</p>
                <p className="text-2xl font-bold">{totalRatings}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đánh giá trung bình</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averageRating) ? "text-yellow-500 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Xu hướng (30 ngày)</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {ratingTrend > 0 ? `+${ratingTrend.toFixed(1)}` : ratingTrend.toFixed(1)}
                  </p>
                  {ratingTrend > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : ratingTrend < 0 ? (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  ) : (
                    <div className="h-5 w-5 text-gray-400">—</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đánh giá tích cực</p>
                <p className="text-2xl font-bold">
                  {ratingDistribution.filter(r => r.star >= 4).reduce((sum, r) => sum + r.count, 0)}
                </p>
              </div>
              <div className="text-green-500">👍</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố đánh giá của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{star}</span>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground w-20 text-right">
                  {count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tên bệnh nhân, nhận xét..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Đánh giá</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả đánh giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đánh giá</SelectItem>
                  <SelectItem value="5">5 sao</SelectItem>
                  <SelectItem value="4">4 sao</SelectItem>
                  <SelectItem value="3">3 sao</SelectItem>
                  <SelectItem value="2">2 sao</SelectItem>
                  <SelectItem value="1">1 sao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Thời gian</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Đánh giá từ bệnh nhân ({filteredRatings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRatings.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có đánh giá nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRatings.map((rating) => {
                const user = users.find(u => u.id === rating.userId)
                
                return (
                  <div
                    key={rating.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{user?.name || "Bệnh nhân không xác định"}</h4>
                          <p className="text-sm text-gray-600">Đánh giá cho cuộc tư vấn</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRatingBadge(rating.rating || 0)}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (rating.rating || 0) ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Cuộc hẹn: {new Date(rating.date).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Đánh giá: {new Date(rating.ratedAt || "").toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    {rating.ratingComment && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 italic">"{rating.ratingComment}"</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
