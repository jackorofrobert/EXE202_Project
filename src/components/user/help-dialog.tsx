"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { HelpCircle, Home, MessageCircle, Calendar, BookOpen, User, Crown, Sparkles, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, Info, FileText, Zap, Shield } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Badge } from "../ui/badge"

export default function HelpDialog({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const isGoldUser = user?.tier === "gold"

  const features = [
    {
      icon: Sparkles,
      title: "Ghi nhận cảm xúc hàng ngày",
      description: "Hệ thống sẽ tự động nhắc bạn ghi nhận cảm xúc mỗi ngày khi bạn đăng nhập.",
      color: "text-pink-500",
      steps: [
        "Hệ thống hiển thị modal khi bạn chưa ghi nhận cảm xúc trong ngày",
        "Chọn mức độ cảm xúc từ 1 (rất buồn) đến 5 (rất vui)",
        "Thêm ghi chú tùy chọn về lý do hoặc tình huống",
        "Nhấn 'Xác nhận' để lưu. Có thể 'Bỏ qua' để nhắc lại sau",
        "Xem lại lịch sử cảm xúc và theo dõi chuỗi ngày liên tiếp (streak)"
      ],
      tips: [
        "Ghi nhận vào cùng một thời điểm mỗi ngày để có dữ liệu nhất quán",
        "Thêm ghi chú ngắn để nhớ lại bối cảnh sau này",
        "Chuỗi ngày liên tiếp sẽ giúp bạn duy trì thói quen tích cực"
      ]
    },
    {
      icon: Home,
      title: "Trang chủ - Dashboard",
      description: "Xem tổng quan tình trạng sức khỏe tâm thần của bạn với biểu đồ và thống kê chi tiết.",
      color: "text-blue-500",
      steps: [
        "Xem thống kê nhanh: Tổng số cảm xúc, điểm trung bình, chuỗi ngày liên tiếp",
        "Biểu đồ cảm xúc: Theo dõi xu hướng cảm xúc qua thời gian",
        "Danh sách cảm xúc gần đây: Xem lại các ghi nhận mới nhất",
        "Nâng cấp Gold: Thông báo về ưu đãi nếu bạn chưa nâng cấp"
      ],
      tips: [
        "Kiểm tra biểu đồ mỗi tuần để nhận thấy xu hướng",
        "Nếu điểm cảm xúc thấp liên tục, cân nhắc tư vấn với chuyên gia",
        "Chuỗi ngày liên tiếp là động lực tốt để duy trì thói quen"
      ]
    },
    {
      icon: MessageCircle,
      title: "Chatbot AI",
      description: "Trò chuyện với chatbot thông minh được trang bị công nghệ AI tiên tiến để nhận tư vấn và hỗ trợ tâm lý 24/7.",
      color: "text-purple-500",
      steps: [
        "Nhấn vào mục 'Chatbot' trong menu sidebar",
        "Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn",
        "Chatbot sẽ phản hồi và đưa ra gợi ý phù hợp",
        "Bạn có thể tạo nhiều cuộc hội thoại khác nhau",
        "Xem lại lịch sử trò chuyện bất cứ lúc nào"
      ],
      tips: [
        "Mô tả rõ ràng vấn đề của bạn để nhận phản hồi tốt hơn",
        "Chatbot Free cung cấp tư vấn cơ bản, Gold có AI nâng cao hơn",
        "Nếu chatbot không thể giải quyết, hãy cân nhắc đặt lịch với bác sĩ"
      ]
    },
    {
      icon: Calendar,
      title: "Đặt lịch tư vấn với bác sĩ",
      description: "Đặt lịch tư vấn trực tiếp với bác sĩ tâm lý chuyên nghiệp. Tính năng này chỉ dành cho tài khoản Gold.",
      color: "text-green-500",
      goldOnly: true,
      steps: [
        "Chọn bác sĩ phù hợp từ danh sách (xem thông tin, kinh nghiệm, đánh giá)",
        "Nhấn 'Đặt lịch' và điền thông tin:",
        "  • Chọn ngày và giờ phù hợp",
        "  • Mô tả ngắn gọn lý do tư vấn",
        "  • Đính kèm thông tin bổ sung nếu cần",
        "Xác nhận và đợi bác sĩ phê duyệt (thường trong 24 giờ)",
        "Nhận thông báo khi lịch được xác nhận hoặc từ chối",
        "Tham gia buổi tư vấn theo thời gian đã đặt"
      ],
      tips: [
        "Đọc kỹ profile và đánh giá của bác sĩ trước khi đặt lịch",
        "Mô tả rõ vấn đề để bác sĩ chuẩn bị tốt hơn",
        "Đặt lịch trước ít nhất 2-3 ngày để có nhiều lựa chọn thời gian",
        "Nếu lịch bị từ chối, bạn sẽ nhận được thông báo với lý do"
      ]
    },
    {
      icon: BookOpen,
      title: "Nhật ký cá nhân",
      description: "Ghi chép lại những suy nghĩ, cảm xúc và trải nghiệm hàng ngày để hiểu rõ hơn về bản thân.",
      color: "text-orange-500",
      steps: [
        "Nhấn vào 'Nhật ký' trong menu",
        "Xem danh sách tất cả các entry đã viết (sắp xếp theo ngày mới nhất)",
        "Tạo entry mới:",
        "  • Nhấn nút 'Viết nhật ký mới'",
        "  • Nhập tiêu đề và nội dung",
        "  • Có thể gắn tag hoặc phân loại",
        "  • Lưu entry",
        "Chỉnh sửa hoặc xóa entry cũ bằng cách nhấn vào entry đó"
      ],
      tips: [
        "Viết nhật ký thường xuyên để theo dõi tâm trạng và sự kiện trong cuộc sống",
        "Sử dụng nhật ký để tìm mối liên hệ giữa sự kiện và cảm xúc",
        "Đọc lại nhật ký định kỳ để nhận thấy sự thay đổi và tiến bộ",
        "Nhật ký của bạn được bảo mật hoàn toàn"
      ]
    },
    {
      icon: User,
      title: "Thông tin cá nhân",
      description: "Quản lý thông tin tài khoản, cập nhật avatar, mật khẩu và xem lịch sử hoạt động.",
      color: "text-gray-500",
      steps: [
        "Nhấn vào 'Thông tin' trong menu sidebar",
        "Xem thông tin hiện tại: Tên, email, tier (Free/Gold), ngày tham gia",
        "Chỉnh sửa thông tin:",
        "  • Cập nhật tên hiển thị",
        "  • Thay đổi avatar (upload ảnh mới)",
        "  • Đổi mật khẩu",
        "Xem lịch sử hoạt động và thống kê cá nhân"
      ],
      tips: [
        "Giữ thông tin cập nhật để nhận thông báo và hỗ trợ tốt hơn",
        "Sử dụng avatar rõ ràng để bác sĩ nhận diện khi tư vấn",
        "Đặt mật khẩu mạnh và đổi định kỳ để bảo mật tài khoản"
      ]
    }
  ]

  const faqItems = [
    {
      question: "Làm sao để nâng cấp lên tài khoản Gold?",
      answer: "Bạn có thể nâng cấp bằng cách: 1) Nhấn vào 'Nâng cấp' trong menu hoặc banner trên trang chủ, 2) Chọn gói (tháng/năm), 3) Thanh toán và đợi admin phê duyệt giao dịch. Sau khi được duyệt, tài khoản sẽ tự động nâng cấp lên Gold."
    },
    {
      question: "Tôi có thể ghi nhận cảm xúc nhiều lần trong ngày không?",
      answer: "Không, hệ thống chỉ cho phép ghi nhận cảm xúc một lần mỗi ngày để đảm bảo dữ liệu nhất quán. Bạn có thể chỉnh sửa entry trong ngày nếu cần thay đổi."
    },
    {
      question: "Dữ liệu của tôi có được bảo mật không?",
      answer: "Có, tất cả thông tin và dữ liệu của bạn được mã hóa và bảo mật nghiêm ngặt. Chỉ bạn và bác sĩ (nếu đặt lịch) mới có thể xem thông tin cá nhân. Chúng tôi tuân thủ các quy định về bảo vệ dữ liệu cá nhân."
    },
    {
      question: "Làm sao để liên hệ với bác sĩ nếu tôi là user Free?",
      answer: "Bạn cần nâng cấp lên Gold để có thể đặt lịch và chat trực tiếp với bác sĩ. Tuy nhiên, bạn vẫn có thể sử dụng chatbot AI miễn phí để được hỗ trợ cơ bản."
    },
    {
      question: "Tôi có thể hủy hoặc đổi lịch hẹn với bác sĩ không?",
      answer: "Có, bạn có thể hủy hoặc yêu cầu đổi lịch hẹn bằng cách liên hệ với bác sĩ qua tin nhắn hoặc thông báo cho admin. Tuy nhiên, vui lòng hủy trước ít nhất 24 giờ để tránh ảnh hưởng đến lịch của bác sĩ."
    },
    {
      question: "Chuỗi ngày liên tiếp (streak) được tính như thế nào?",
      answer: "Streak được tính bằng số ngày liên tiếp bạn ghi nhận cảm xúc. Nếu bạn bỏ qua một ngày, streak sẽ bị reset về 0. Streak giúp bạn duy trì thói quen tích cực theo dõi sức khỏe tâm thần."
    },
    {
      question: "Chatbot AI có thay thế được bác sĩ thật không?",
      answer: "Không, chatbot AI chỉ hỗ trợ và tư vấn cơ bản. Đối với các vấn đề nghiêm trọng hoặc cần chẩn đoán chuyên sâu, bạn nên đặt lịch tư vấn với bác sĩ tâm lý thật. Chatbot là công cụ bổ trợ, không thay thế tư vấn chuyên nghiệp."
    },
    {
      question: "Tài khoản Gold có thời hạn bao lâu?",
      answer: "Tài khoản Gold có hai gói: Gói tháng (30 ngày) và gói năm (365 ngày). Sau khi hết hạn, bạn sẽ quay về tài khoản Free nhưng vẫn giữ nguyên dữ liệu và lịch sử. Bạn có thể gia hạn bất cứ lúc nào."
    }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="relative">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Trợ giúp</span>
          </Button>
        ) : (
          <Button variant="secondary" className="w-full justify-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Trợ giúp
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Hướng dẫn sử dụng chi tiết - EmoCare
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="features">Tính năng</TabsTrigger>
            <TabsTrigger value="guide">Hướng dẫn</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Giới thiệu */}
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Chào mừng đến với EmoCare! 👋
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                EmoCare là nền tảng chăm sóc sức khỏe tâm thần toàn diện, giúp bạn theo dõi cảm xúc, 
                nhận tư vấn từ AI và kết nối với các chuyên gia tâm lý.
              </p>
              <div className="grid md:grid-cols-3 gap-3 mt-4">
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-sm">Theo dõi cảm xúc</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Ghi nhận và phân tích xu hướng tâm trạng hàng ngày</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold text-sm">AI Tư vấn</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Chatbot thông minh hỗ trợ 24/7</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-sm">Chuyên gia</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Kết nối với bác sĩ tâm lý chuyên nghiệp</p>
                </div>
              </div>
            </div>

            {/* Gói dịch vụ */}
            <div>
              <h3 className="font-semibold text-lg mb-4">So sánh gói dịch vụ</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-semibold text-lg">Tài khoản Free</h4>
                    <Badge variant="secondary">Miễn phí</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ghi nhận cảm xúc hàng ngày</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Xem thống kê và biểu đồ cảm xúc</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Viết nhật ký không giới hạn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Chatbot AI cơ bản (giới hạn số tin nhắn)</span>
                    </li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-lg">Tài khoản Gold</h4>
                    <Badge className="bg-yellow-500 text-yellow-900">Trả phí</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Tất cả tính năng Free</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Chatbot AI nâng cao (không giới hạn)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Đặt lịch tư vấn với bác sĩ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Chat trực tiếp với bác sĩ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ưu tiên hỗ trợ và phản hồi nhanh</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mẹo sử dụng */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
                <Zap className="h-5 w-5" />
                Mẹo sử dụng hiệu quả
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Ghi nhận cảm xúc mỗi ngày vào cùng thời điểm để có dữ liệu chính xác và theo dõi xu hướng tốt hơn</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Viết nhật ký thường xuyên để hiểu rõ hơn về bản thân và các yếu tố ảnh hưởng đến tâm trạng</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Sử dụng chatbot khi cần hỗ trợ nhanh hoặc muốn trò chuyện về vấn đề của mình. Mô tả rõ ràng để nhận phản hồi tốt hơn</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Nếu bạn cần hỗ trợ chuyên sâu, nâng cấp lên Gold để được tư vấn trực tiếp với bác sĩ</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Xem lại biểu đồ thống kê định kỳ (hàng tuần) để nhận thấy những thay đổi và xu hướng cảm xúc</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Duy trì chuỗi ngày liên tiếp (streak) như một động lực để giữ thói quen tích cực</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const isLocked = feature.goldOnly && !isGoldUser
                
                return (
                  <div
                    key={index}
                    className={`rounded-lg border p-4 ${
                      isLocked 
                        ? "bg-muted/50 border-muted opacity-60" 
                        : "bg-card hover:shadow-md transition-shadow"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 ${feature.color}`}>
                        <Icon className="h-8 w-8" />
                        {feature.goldOnly && (
                          <Crown className="h-5 w-5 mt-2 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{feature.title}</h4>
                          {feature.goldOnly && (
                            <Badge className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Gold Only
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {feature.description}
                        </p>
                        {feature.steps && (
                          <div className="mb-3">
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-primary" />
                              Các bước sử dụng:
                            </h5>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                              {feature.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                        {feature.tips && (
                          <div className="bg-accent/50 rounded-lg p-3">
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              Mẹo hữu ích:
                            </h5>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {feature.tips.map((tip, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4 mt-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-900">
                <FileText className="h-5 w-5" />
                Hướng dẫn bắt đầu nhanh
              </h3>
              <div className="space-y-3 text-sm text-green-800">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-medium mb-1">Đăng nhập vào tài khoản của bạn</p>
                    <p className="text-xs text-green-700">Sử dụng email và mật khẩu đã đăng ký</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-medium mb-1">Ghi nhận cảm xúc đầu tiên</p>
                    <p className="text-xs text-green-700">Hệ thống sẽ tự động hiển thị modal khi bạn chưa ghi nhận trong ngày</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-medium mb-1">Khám phá các tính năng</p>
                    <p className="text-xs text-green-700">Xem trang chủ, thử chatbot AI, viết nhật ký</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-xs">
                    4
                  </div>
                  <div>
                    <p className="font-medium mb-1">Nâng cấp lên Gold (tùy chọn)</p>
                    <p className="text-xs text-green-700">Nếu cần tư vấn chuyên sâu với bác sĩ, nâng cấp để mở khóa tất cả tính năng</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quy trình làm việc hàng ngày</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    Buổi sáng (9:00 - 10:00)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ghi nhận cảm xúc khi vừa thức dậy hoặc khi bắt đầu ngày làm việc. 
                    Đây là thời điểm tốt để đánh giá tâm trạng ban đầu.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                    Buổi trưa/tối (khi có thời gian rảnh)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Viết nhật ký về những sự kiện trong ngày, sử dụng chatbot nếu có vấn đề cần tư vấn, 
                    hoặc xem lại biểu đồ cảm xúc để theo dõi tiến trình.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Cuối tuần
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Xem lại tổng quan tuần, phân tích xu hướng cảm xúc, và nếu cần, đặt lịch tư vấn với bác sĩ 
                    cho tuần tiếp theo (nếu là Gold member).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-semibold text-lg mb-2 text-yellow-900 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Lưu ý quan trọng
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Nếu cảm xúc của bạn ở mức rất thấp (1-2) liên tục trong nhiều ngày, hãy cân nhắc tư vấn với chuyên gia</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Chatbot AI không thay thế tư vấn y tế chuyên nghiệp. Với các vấn đề nghiêm trọng, hãy liên hệ bác sĩ</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Dữ liệu của bạn được bảo mật. Chỉ bạn và bác sĩ (nếu đặt lịch) mới có thể xem</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Nếu gặp sự cố kỹ thuật, vui lòng liên hệ đội ngũ hỗ trợ qua chatbot hoặc email</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4 mt-4">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 mt-4">
              <h3 className="font-semibold text-lg mb-2">Cần thêm trợ giúp?</h3>
              <p className="text-sm text-muted-foreground">
                Nếu bạn có bất kỳ câu hỏi nào khác hoặc gặp vấn đề khi sử dụng, vui lòng liên hệ với 
                đội ngũ hỗ trợ của chúng tôi thông qua chatbot hoặc email hỗ trợ. Chúng tôi luôn sẵn sàng giúp đỡ bạn!
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
