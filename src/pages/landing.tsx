import { Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import Logo from "../components/ui/logo"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { 
  Heart, 
  Brain, 
  Users, 
  Calendar, 
  MessageCircle, 
  Star,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react"

export default function LandingPage() {
  const { user } = useAuth()

  const handleLogoClick = () => {
    if (user) {
      // If user is logged in, navigate to dashboard
      window.location.href = "/dashboard"
    }
    // If not logged in, stay on landing page
  }

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "Theo dõi cảm xúc",
      description: "Ghi nhận và phân tích trạng thái cảm xúc hàng ngày của bạn"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: "Chatbot AI thông minh",
      description: "Trò chuyện với AI để được tư vấn và hỗ trợ tâm lý 24/7"
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      title: "Đặt lịch tư vấn",
      description: "Kết nối với bác sĩ tâm lý chuyên nghiệp qua video call"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Nhật ký cá nhân",
      description: "Viết nhật ký để thể hiện suy nghĩ và cảm xúc của bạn"
    }
  ]

  const benefits = [
    "Theo dõi sức khỏe tâm lý hàng ngày",
    "Tư vấn AI miễn phí 24/7",
    "Kết nối với bác sĩ chuyên nghiệp",
    "Bảo mật thông tin tuyệt đối",
    "Giao diện thân thiện, dễ sử dụng"
  ]

  const stats = [
    { number: "10K+", label: "Người dùng tin tưởng" },
    { number: "50+", label: "Bác sĩ tâm lý" },
    { number: "99%", label: "Độ hài lòng" },
    { number: "24/7", label: "Hỗ trợ AI" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
              <Logo size="md" clickable={false} iconOnly={true} className="scale-125" />
              <span className="text-2xl font-bold text-gray-800">EmoCare</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Chăm sóc sức khỏe tâm lý
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> thông minh</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              EmoCare là nền tảng toàn diện giúp bạn theo dõi, chăm sóc và cải thiện sức khỏe tâm lý 
              với sự hỗ trợ của AI và các chuyên gia tâm lý hàng đầu.
            </p>
            <div className="flex gap-4 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg">
                  Bắt đầu miễn phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Xem demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Các công cụ và dịch vụ được thiết kế đặc biệt để hỗ trợ sức khỏe tâm lý của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Tại sao chọn EmoCare?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Chúng tôi cam kết mang đến trải nghiệm chăm sóc sức khỏe tâm lý tốt nhất 
                với công nghệ tiên tiến và đội ngũ chuyên gia giàu kinh nghiệm.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <Users className="h-8 w-8 text-blue-600 mb-3" />
                    <div className="text-2xl font-bold text-gray-800">10K+</div>
                    <div className="text-sm text-gray-600">Người dùng</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <Star className="h-8 w-8 text-yellow-600 mb-3" />
                    <div className="text-2xl font-bold text-gray-800">4.9</div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <Shield className="h-8 w-8 text-green-600 mb-3" />
                    <div className="text-2xl font-bold text-gray-800">100%</div>
                    <div className="text-sm text-gray-600">Bảo mật</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <Zap className="h-8 w-8 text-purple-600 mb-3" />
                    <div className="text-2xl font-bold text-gray-800">24/7</div>
                    <div className="text-sm text-gray-600">Hỗ trợ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe tâm lý?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người đã tin tưởng EmoCare để cải thiện chất lượng cuộc sống
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Đăng ký ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-purple-600">
                Đã có tài khoản?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Logo size="md" clickable={false} iconOnly={true} className="scale-125" />
                <span className="text-xl font-bold">EmoCare</span>
              </div>
              <p className="text-gray-400">
                Nền tảng chăm sóc sức khỏe tâm lý toàn diện với AI và chuyên gia hàng đầu.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Theo dõi cảm xúc</li>
                <li>Chatbot AI</li>
                <li>Tư vấn chuyên gia</li>
                <li>Nhật ký cá nhân</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Trung tâm trợ giúp</li>
                <li>Liên hệ</li>
                <li>Bảo mật</li>
                <li>Điều khoản</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kết nối</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EmoCare. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
