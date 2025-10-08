import { Link } from "react-router-dom"

export default function UpgradePrompt() {
  return (
    <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-6 border border-accent/30 mb-6">
      <h3 className="text-lg font-semibold mb-2">Nâng cấp để trò chuyện không giới hạn</h3>
      <p className="text-muted-foreground mb-4">
        Với tài khoản Gold, bạn có thể tâm sự và nhận tư vấn chuyên sâu từ AI chatbot của chúng tôi
      </p>
      <Link
        to="/dashboard/upgrade"
        className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Nâng cấp ngay
      </Link>
    </div>
  )
}
