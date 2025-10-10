import { Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import Logo from "../components/ui/logo"

export default function LandingPage() {
  const { user } = useAuth()

  const handleLogoClick = () => {
    if (user) {
      // If user is logged in, navigate to dashboard
      window.location.href = "/dashboard"
    }
    // If not logged in, stay on landing page
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center items-center mb-8 cursor-pointer" onClick={handleLogoClick}>
            <Logo size="lg" clickable={false} iconOnly={true} className="scale-150" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">EmoCare</h1>
          <p className="text-xl text-gray-600 mb-12">Nền tảng chăm sóc sức khỏe tâm lý toàn diện</p>
          <div className="flex gap-6 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
