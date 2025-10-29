"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { HelpCircle, Calendar, MessageCircle, User, Star, Clock, CheckCircle, XCircle, TrendingUp, AlertCircle, ArrowRight, Info, FileText, Zap, Shield, Users, Bell, MessageSquare, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Badge } from "../ui/badge"

export default function PsychologistHelpDialog({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const [open, setOpen] = useState(false)

  const features = [
    {
      icon: Calendar,
      title: "Quản lý lịch hẹn",
      description: "Xem và quản lý tất cả các lịch hẹn từ người dùng. Phê duyệt, từ chối hoặc hoãn các yêu cầu đặt lịch. Xem chi tiết thông tin bệnh nhân và lý do tư vấn.",
      color: "text-blue-500",
      steps: [
        "Vào trang 'Lịch hẹn' từ menu sidebar",
        "Xem danh sách lịch hẹn được phân loại theo trạng thái:",
        "  • Đang chờ: Lịch hẹn mới, cần bạn xem xét",
        "  • Đã xác nhận: Lịch hẹn đã được chấp nhận",
        "  • Đã từ chối: Lịch hẹn bị từ chối",
        "  • Đã hoàn thành: Buổi tư vấn đã kết thúc",
        "Nhấn vào từng lịch hẹn để xem chi tiết:",
        "  • Thông tin bệnh nhân (tên, email, tier)",
        "  • Ngày giờ yêu cầu tư vấn",
        "  • Lý do tư vấn và mô tả vấn đề",
        "  • Thông tin đặt lịch trước đó (nếu có)",
        "Thực hiện hành động:",
        "  • Chấp nhận: Nhấn nút 'Chấp nhận' và có thể thêm ghi chú",
        "  • Từ chối: Nhấn 'Từ chối' và nhập lý do (bắt buộc)",
        "  • Hoãn lại: Yêu cầu đặt lịch khác và thông báo cho bệnh nhân",
        "Sau buổi tư vấn: Đánh dấu là 'Đã hoàn thành' và thêm ghi chú kết quả"
      ],
      tips: [
        "Phản hồi các yêu cầu trong vòng 24 giờ để đảm bảo trải nghiệm tốt cho bệnh nhân",
        "Đọc kỹ thông tin bệnh nhân và lý do tư vấn trước khi chấp nhận",
        "Nếu không thể nhận thêm bệnh nhân, từ chối sớm với lý do rõ ràng",
        "Thêm ghi chú chi tiết sau mỗi buổi tư vấn để theo dõi tiến trình",
        "Kiểm tra lịch hẹn hàng ngày để không bỏ sót yêu cầu mới"
      ],
      important: [
        "Luôn giữ thông tin bệnh nhân bảo mật và tuân thủ quy định y tế",
        "Thông báo sớm nếu không thể thực hiện lịch hẹn đã xác nhận",
        "Phản hồi chuyên nghiệp và tôn trọng với mọi yêu cầu"
      ]
    },
    {
      icon: MessageCircle,
      title: "Tin nhắn",
      description: "Giao tiếp trực tiếp với người dùng thông qua tin nhắn. Trả lời câu hỏi, cung cấp hỗ trợ và tư vấn cho họ mọi lúc mọi nơi.",
      color: "text-green-500",
      steps: [
        "Vào trang 'Tin nhắn' từ menu sidebar",
        "Xem danh sách tất cả cuộc trò chuyện với người dùng:",
        "  • Danh sách được sắp xếp theo tin nhắn mới nhất",
        "  • Hiển thị số tin nhắn chưa đọc (badge đỏ)",
        "  • Xem tin nhắn cuối cùng và thời gian",
        "Nhấn vào một cuộc trò chuyện để mở:",
        "  • Xem toàn bộ lịch sử tin nhắn",
        "  • Nhập tin nhắn mới vào ô chat ở dưới",
        "  • Nhấn Enter hoặc nút gửi để gửi",
        "Đánh dấu đã đọc: Tin nhắn sẽ tự động cập nhật trạng thái",
        "Quản lý cuộc trò chuyện:",
        "  • Tìm kiếm trong lịch sử chat",
        "  • Xem thông tin bệnh nhân từ chat"
      ],
      tips: [
        "Kiểm tra tin nhắn thường xuyên (ít nhất 2-3 lần/ngày)",
        "Phản hồi trong vòng vài giờ nếu có thể, đặc biệt với tin nhắn khẩn cấp",
        "Sử dụng ngôn ngữ chuyên nghiệp nhưng thân thiện",
        "Không chia sẻ thông tin bệnh nhân với bên thứ ba",
        "Gửi tin nhắn theo dõi sau buổi tư vấn để hỏi tình hình"
      ],
      important: [
        "Tin nhắn không thay thế tư vấn chính thức, chỉ là hỗ trợ bổ sung",
        "Với các vấn đề nghiêm trọng, đề xuất đặt lịch tư vấn chính thức",
        "Bảo mật tất cả thông tin trao đổi"
      ]
    },
    {
      icon: Star,
      title: "Đánh giá",
      description: "Xem tất cả các đánh giá và phản hồi từ người dùng về dịch vụ tư vấn của bạn. Cải thiện chất lượng dịch vụ dựa trên phản hồi.",
      color: "text-yellow-500",
      steps: [
        "Vào trang 'Đánh giá' từ menu sidebar",
        "Xem tổng quan:",
        "  • Điểm đánh giá trung bình (1-5 sao)",
        "  • Tổng số đánh giá",
        "  • Phân bố đánh giá theo mức sao",
        "Xem danh sách đánh giá chi tiết:",
        "  • Đánh giá mới nhất hiển thị ở đầu",
        "  • Xem điểm số, bình luận của bệnh nhân",
        "  • Xem thông tin bệnh nhân (nếu có quyền)",
        "  • Xem ngày đánh giá và lịch hẹn liên quan",
        "Theo dõi xu hướng:",
        "  • Phân tích đánh giá theo thời gian",
        "  • Xác định điểm mạnh và cần cải thiện"
      ],
      tips: [
        "Đọc tất cả đánh giá để hiểu phản hồi của bệnh nhân",
        "Phản hồi lại đánh giá tiêu cực một cách chuyên nghiệp (nếu có thể)",
        "Sử dụng phản hồi để cải thiện phương pháp tư vấn",
        "Không xóa hoặc chỉnh sửa đánh giá",
        "Cảm ơn bệnh nhân cho đánh giá tích cực"
      ]
    },
    {
      icon: User,
      title: "Quản lý hồ sơ",
      description: "Cập nhật thông tin cá nhân, chuyên môn, kinh nghiệm và ảnh đại diện. Thông tin này sẽ hiển thị cho người dùng khi họ đặt lịch.",
      color: "text-purple-500",
      steps: [
        "Vào trang 'Hồ sơ' từ menu sidebar",
        "Xem thông tin hiện tại:",
        "  • Tên, email, số điện thoại",
        "  • Ảnh đại diện",
        "  • Chuyên môn và trình độ",
        "  • Kinh nghiệm làm việc",
        "  • Mô tả về bản thân",
        "Chỉnh sửa thông tin:",
        "  • Nhấn nút 'Chỉnh sửa'",
        "  • Cập nhật các trường thông tin cần thiết",
        "  • Upload ảnh đại diện mới (nếu muốn)",
        "  • Thêm/sửa/xóa kinh nghiệm làm việc",
        "  • Cập nhật mô tả chuyên môn",
        "  • Lưu thay đổi",
        "Quản lý ảnh:",
        "  • Chọn ảnh rõ ràng, chuyên nghiệp",
        "  • Kích thước phù hợp (khuyến nghị: vuông, 400x400px)"
      ],
      tips: [
        "Cập nhật hồ sơ thường xuyên với thông tin mới nhất",
        "Viết mô tả chuyên môn rõ ràng và hấp dẫn",
        "Liệt kê đầy đủ kinh nghiệm và chứng chỉ",
        "Ảnh đại diện chuyên nghiệp sẽ tăng độ tin cậy",
        "Thông tin chính xác giúp bệnh nhân chọn đúng bác sĩ"
      ]
    }
  ]

  const statusGuide = [
    {
      icon: Clock,
      status: "Đang chờ",
      description: "Lịch hẹn mới được tạo và chờ bạn xem xét",
      action: "Bạn nên xem xét và phê duyệt hoặc từ chối trong vòng 24 giờ",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      icon: CheckCircle,
      status: "Đã xác nhận",
      description: "Lịch hẹn đã được bạn chấp nhận",
      action: "Chuẩn bị và thực hiện tư vấn theo thời gian đã đặt",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: XCircle,
      status: "Đã từ chối",
      description: "Lịch hẹn đã bị từ chối",
      action: "Người dùng sẽ được thông báo về lý do từ chối",
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: Users,
      status: "Đã hoàn thành",
      description: "Buổi tư vấn đã được thực hiện",
      action: "Thêm ghi chú về kết quả và đề xuất tiếp theo cho bệnh nhân",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ]

  const workflowGuide = [
    {
      title: "Kiểm tra yêu cầu mới",
      time: "Mỗi buổi sáng / Khi có thông báo",
      tasks: [
        "Mở trang 'Lịch hẹn'",
        "Xem các lịch hẹn có trạng thái 'Đang chờ'",
        "Đọc thông tin bệnh nhân và lý do tư vấn",
        "Quyết định chấp nhận hoặc từ chối"
      ]
    },
    {
      title: "Quản lý tin nhắn",
      time: "2-3 lần/ngày",
      tasks: [
        "Kiểm tra tin nhắn mới trong trang 'Tin nhắn'",
        "Trả lời các câu hỏi và thắc mắc",
        "Theo dõi tin nhắn từ bệnh nhân đang tư vấn",
        "Đánh dấu đã đọc"
      ]
    },
    {
      title: "Chuẩn bị buổi tư vấn",
      time: "Trước mỗi buổi tư vấn",
      tasks: [
        "Xem lại thông tin bệnh nhân và lịch sử",
        "Đọc lại ghi chú từ các buổi tư vấn trước",
        "Chuẩn bị phương pháp và tài liệu cần thiết"
      ]
    },
    {
      title: "Sau buổi tư vấn",
      time: "Ngay sau khi kết thúc",
      tasks: [
        "Đánh dấu lịch hẹn là 'Đã hoàn thành'",
        "Thêm ghi chú về nội dung tư vấn",
        "Ghi lại đề xuất và kế hoạch tiếp theo",
        "Gửi tin nhắn theo dõi nếu cần"
      ]
    }
  ]

  const faqItems = [
    {
      question: "Làm sao để quản lý nhiều lịch hẹn cùng lúc?",
      answer: "Bạn có thể xem tất cả lịch hẹn trong trang 'Lịch hẹn' và lọc theo trạng thái. Hệ thống sẽ tự động sắp xếp theo thời gian. Bạn có thể từ chối lịch hẹn nếu không thể nhận thêm hoặc yêu cầu đổi thời gian phù hợp hơn."
    },
    {
      question: "Tôi có thể thay đổi lịch hẹn đã xác nhận không?",
      answer: "Có, bạn có thể liên hệ với bệnh nhân qua tin nhắn để thống nhất đổi lịch. Tuy nhiên, nên thông báo sớm (ít nhất 24-48 giờ trước) để bệnh nhân có thời gian sắp xếp lại. Trong trường hợp khẩn cấp, hãy thông báo ngay lập tức."
    },
    {
      question: "Làm sao để xử lý tin nhắn từ nhiều bệnh nhân?",
      answer: "Trang 'Tin nhắn' hiển thị tất cả cuộc trò chuyện với số tin nhắn chưa đọc. Bạn nên kiểm tra và trả lời theo thứ tự ưu tiên: tin nhắn khẩn cấp, tin nhắn từ bệnh nhân đang trong quá trình tư vấn, sau đó là các tin nhắn khác."
    },
    {
      question: "Thông tin bệnh nhân có được bảo mật không?",
      answer: "Có, tất cả thông tin bệnh nhân được bảo mật nghiêm ngặt theo quy định y tế. Chỉ bạn và bệnh nhân mới có thể xem thông tin trao đổi. Bạn cần tuân thủ quy tắc bảo mật và không chia sẻ thông tin với bên thứ ba."
    },
    {
      question: "Tôi có thể xem lịch sử tư vấn của bệnh nhân không?",
      answer: "Có, trong chi tiết lịch hẹn và khi chat với bệnh nhân, bạn có thể xem lịch sử các buổi tư vấn trước đó (nếu có) để hiểu rõ hơn về tình trạng và tiến trình của bệnh nhân."
    },
    {
      question: "Làm sao để cải thiện đánh giá từ bệnh nhân?",
      answer: "Để nhận đánh giá tốt: 1) Phản hồi nhanh các yêu cầu, 2) Chuẩn bị kỹ cho mỗi buổi tư vấn, 3) Giao tiếp chuyên nghiệp và thân thiện, 4) Theo dõi sau tư vấn, 5) Cập nhật hồ sơ đầy đủ và chính xác."
    },
    {
      question: "Tôi có thể từ chối lịch hẹn mà không cần lý do không?",
      answer: "Không, khi từ chối lịch hẹn, bạn cần nhập lý do (bắt buộc) để bệnh nhân hiểu và có thể chọn bác sĩ khác phù hợp hơn. Lý do nên chuyên nghiệp và rõ ràng."
    },
    {
      question: "Làm sao để quản lý thời gian làm việc hiệu quả?",
      answer: "Mẹo quản lý thời gian: 1) Kiểm tra lịch hẹn mỗi sáng, 2) Dành thời gian cố định để trả lời tin nhắn (ví dụ: 2-3 lần/ngày), 3) Chuẩn bị trước cho các buổi tư vấn, 4) Ghi chú ngay sau mỗi buổi tư vấn, 5) Không nhận quá nhiều lịch hẹn trong một ngày."
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Hướng dẫn sử dụng chi tiết - Bác sĩ tâm lý
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="features">Tính năng</TabsTrigger>
            <TabsTrigger value="workflow">Quy trình</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Chào mừng đến với EmoCare! 👋
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Nền tảng này giúp bạn quản lý hiệu quả công việc tư vấn tâm lý, giao tiếp với bệnh nhân 
                và theo dõi đánh giá dịch vụ của mình.
              </p>
              <div className="grid md:grid-cols-3 gap-3 mt-4">
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-sm">Quản lý lịch hẹn</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Xem và xử lý yêu cầu đặt lịch từ bệnh nhân</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-sm">Tin nhắn</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Giao tiếp trực tiếp với bệnh nhân</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-sm">Đánh giá</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Xem phản hồi và cải thiện dịch vụ</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Trạng thái lịch hẹn</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {statusGuide.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className={`${item.bgColor} ${item.borderColor} border rounded-lg p-4`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-6 w-6 ${item.color}`} />
                        <h4 className="font-semibold">{item.status}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <p className="text-xs text-muted-foreground italic">{item.action}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
                <Zap className="h-5 w-5" />
                Mẹo làm việc hiệu quả
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Phản hồi các yêu cầu đặt lịch trong vòng 24 giờ để đảm bảo trải nghiệm tốt cho người dùng</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Thường xuyên kiểm tra tin nhắn (2-3 lần/ngày) để kịp thời hỗ trợ người dùng khi họ cần</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Đọc kỹ thông tin bệnh nhân trước khi chấp nhận lịch hẹn để đảm bảo bạn có thể hỗ trợ tốt nhất</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Cập nhật hồ sơ của bạn thường xuyên với thông tin mới nhất về chuyên môn và kinh nghiệm</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Xem lại các đánh giá để hiểu điểm mạnh và cải thiện chất lượng dịch vụ</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Thêm ghi chú sau mỗi buổi tư vấn để theo dõi tiến trình của bệnh nhân</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-semibold text-lg mb-2 text-yellow-800 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ⚠️ Quy tắc quan trọng
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Luôn bảo mật thông tin bệnh nhân theo quy định về bảo mật y tế. Không chia sẻ thông tin với bên thứ ba</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Phản hồi chuyên nghiệp và tôn trọng đối với mọi người dùng, kể cả khi từ chối lịch hẹn</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Thông báo sớm (ít nhất 24 giờ) nếu không thể thực hiện lịch hẹn đã xác nhận</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Tuân thủ các quy tắc đạo đức nghề nghiệp trong tư vấn tâm lý</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                
                return (
                  <div
                    key={index}
                    className="rounded-lg border bg-card hover:shadow-md transition-shadow p-4"
                  >
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 ${feature.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
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
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <Zap className="h-4 w-4 text-blue-500" />
                              Mẹo hữu ích:
                            </h5>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {feature.tips.map((tip, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span className="text-blue-600">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {feature.important && (
                          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              Lưu ý quan trọng:
                            </h5>
                            <ul className="space-y-1 text-sm text-yellow-800">
                              {feature.important.map((item, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span>•</span>
                                  <span>{item}</span>
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

          <TabsContent value="workflow" className="space-y-4 mt-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-900">
                <FileText className="h-5 w-5" />
                Quy trình làm việc đề xuất
              </h3>
              <div className="space-y-4">
                {workflowGuide.map((workflow, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{workflow.title}</h4>
                          <Badge variant="outline" className="text-xs">{workflow.time}</Badge>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground mt-3">
                          {workflow.tasks.map((task, idx) => (
                            <li key={idx} className="flex gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tối ưu hóa hiệu quả làm việc
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Quản lý thời gian</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Dành thời gian cố định để xử lý yêu cầu</li>
                    <li>• Ưu tiên lịch hẹn đã xác nhận</li>
                    <li>• Trả lời tin nhắn theo batch (2-3 lần/ngày)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Tổ chức công việc</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Ghi chú ngay sau mỗi buổi tư vấn</li>
                    <li>• Xem lại thông tin bệnh nhân trước mỗi buổi</li>
                    <li>• Theo dõi tiến trình qua các buổi tư vấn</li>
                  </ul>
                </div>
              </div>
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
                Nếu bạn có bất kỳ câu hỏi nào về cách sử dụng hệ thống hoặc gặp sự cố kỹ thuật, 
                vui lòng liên hệ với đội ngũ quản trị viên để được hỗ trợ. Chúng tôi luôn sẵn sàng giúp đỡ bạn!
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
