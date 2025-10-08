import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">EmoCare</h1>
          <p className="text-xl text-muted-foreground mb-8">Nền tảng chăm sóc sức khỏe tâm lý toàn diện</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
