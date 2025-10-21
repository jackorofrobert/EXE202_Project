"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import Logo from "../../components/ui/logo"
import StatsCard from "../../components/admin/stats-card"
import EmotionChart from "../../components/admin/emotion-chart"
import UserGrowthChart from "../../components/admin/user-growth-chart"
import BookingStatsChart from "../../components/admin/booking-stats-chart"
import UserModal from "../../components/admin/user-modal"
import PsychologistModal from "../../components/admin/psychologist-modal"
import TransactionManagement from "../../components/admin/transaction-management"
import VoucherManagement from "../../components/admin/voucher-management"
import AdminRatingsPage from "./ratings"
import { Button } from "../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { LockIcon, UserIcon, LogOutIcon } from "lucide-react"
import type { AnalyticsData, User, Psychologist } from "../../types"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [trends, setTrends] = useState<{
    userGrowth: number
    activeUserGrowth: number
    psychologistGrowth: number
    bookingGrowth: number
  } | null>(null)
  const [userGrowthData, setUserGrowthData] = useState<{ date: string; users: number }[]>([])
  const [bookingStatsData, setBookingStatsData] = useState<{ month: string; bookings: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'psychologists' | 'transactions' | 'vouchers' | 'ratings'>('overview')
  
  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isPsychologistModalOpen, setIsPsychologistModalOpen] = useState(false)
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [analyticsData, usersData, psychologistsData, trendsData, userGrowthData, bookingStatsData] = await Promise.all([
        FirestoreService.getAdminAnalytics(),
        FirestoreService.getAllUsers(),
        FirestoreService.getPsychologists(),
        FirestoreService.getAnalyticsTrends(),
        FirestoreService.getUserGrowthData(),
        FirestoreService.getBookingStatsData()
      ])
      
      setAnalytics(analyticsData)
      setAllUsers(usersData)
      setPsychologists(psychologistsData)
      setTrends(trendsData)
      
      // Store real data for charts
      setUserGrowthData(userGrowthData)
      setBookingStatsData(bookingStatsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Không thể tải dữ liệu analytics</p>
        </div>
      </div>
    )
  }


  // Modal handlers
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsUserModalOpen(true)
  }

  const handleEditPsychologist = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist)
    setIsPsychologistModalOpen(true)
  }

  const handleAddPsychologist = () => {
    setSelectedPsychologist(null)
    setIsPsychologistModalOpen(true)
  }

  const handleModalSuccess = () => {
    loadData() // Reload data after successful operation
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" iconOnly={true} className="scale-125" />
            <div>
              <h1 className="text-2xl font-bold">EmoCare Admin</h1>
              <p className="text-sm text-muted-foreground">Xin chào, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/change-password")}>
                  <LockIcon className="h-4 w-4 mr-2" />
                  Thay đổi mật khẩu
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOutIcon className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Quản lý Users ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('psychologists')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'psychologists'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bác sĩ tâm lý ({psychologists.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Giao dịch
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'vouchers'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Voucher
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'ratings'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đánh giá
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Tổng người dùng"
                value={analytics.totalUsers}
                icon="👥"
                trend={trends ? { value: trends.userGrowth, isPositive: trends.userGrowth >= 0 } : undefined}
              />
              <StatsCard
                title="Người dùng hoạt động"
                value={analytics.activeUsers}
                icon="✅"
                trend={trends ? { value: trends.activeUserGrowth, isPositive: trends.activeUserGrowth >= 0 } : undefined}
              />
              <StatsCard
                title="Bác sĩ tâm lý"
                value={analytics.totalPsychologists}
                icon="👨‍⚕️"
                trend={trends ? { value: trends.psychologistGrowth, isPositive: trends.psychologistGrowth >= 0 } : undefined}
              />
              <StatsCard
                title="Lượt đặt lịch"
                value={analytics.totalBookings}
                icon="📅"
                trend={trends ? { value: trends.bookingGrowth, isPositive: trends.bookingGrowth >= 0 } : undefined}
              />
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <EmotionChart data={analytics.emotionDistribution} />
              <UserGrowthChart data={userGrowthData} />
        </div>

        <div className="grid grid-cols-1 gap-6">
              <BookingStatsChart data={bookingStatsData} />
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quản lý Users</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Thêm User
                </button>
                <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-90">
                  Export
                </button>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'psychologist' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.tier || 'free'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-primary hover:text-primary/80"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'psychologists' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quản lý Bác sĩ tâm lý</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleAddPsychologist}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Thêm Bác sĩ
                </button>
                <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-90">
                  Export
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {psychologists.map((psychologist) => (
                <div key={psychologist.id} className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {psychologist.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold">{psychologist.name}</h3>
                        <p className="text-sm text-muted-foreground">{psychologist.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      psychologist.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {psychologist.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Chuyên môn</p>
                      <p className="text-sm text-muted-foreground">{psychologist.specialization}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Kinh nghiệm</p>
                      <p className="text-sm text-muted-foreground">{psychologist.experience} năm</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Rating</p>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold">{psychologist.rating}</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            ({psychologist.totalRatings || 0} đánh giá)
                          </span>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= Math.floor(psychologist.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-border">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditPsychologist(psychologist)}
                          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90"
                        >
                          Xem chi tiết
                        </button>
                        <button 
                          onClick={() => handleEditPsychologist(psychologist)}
                          className="flex-1 px-3 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:opacity-90"
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionManagement />
        )}

        {activeTab === 'vouchers' && (
          <VoucherManagement />
        )}

        {activeTab === 'ratings' && (
          <AdminRatingsPage />
        )}
      </main>

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />
      
      <PsychologistModal
        isOpen={isPsychologistModalOpen}
        onClose={() => setIsPsychologistModalOpen(false)}
        psychologist={selectedPsychologist}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}