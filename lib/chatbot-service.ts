// Chatbot service for Free and Gold users
import type { ChatMessage } from "@/types"

interface ChatbotResponse {
  message: string
  suggestions?: string[]
}

// Free user suggestions - stress relief activities
const FREE_USER_SUGGESTIONS = {
  cafes: [
    "The Coffee House - Không gian yên tĩnh, phù hợp để thư giãn",
    "Highlands Coffee - Nhiều chi nhánh, view đẹp",
    "Phúc Long - Trà sữa và không gian thoải mái",
    "Cộng Cà Phê - Phong cách hoài cổ, âm nhạc nhẹ nhàng",
  ],
  activities: [
    "Đi dạo công viên Tao Đàn - Không khí trong lành, nhiều cây xanh",
    "Xem phim tại CGV hoặc Lotte Cinema - Giải trí cùng bạn bè",
    "Chơi bowling tại Superbowl - Hoạt động vui vẻ, giảm stress",
    "Tham quan bảo tàng Mỹ thuật - Nghệ thuật giúp thư giãn tâm hồn",
  ],
  restaurants: [
    "Quán Bụi - Món Việt truyền thống, không gian ấm cúng",
    "Pizza 4P's - Pizza ngon, không gian hiện đại",
    "Wrap & Roll - Món cuốn tươi ngon, healthy",
    "Gogi House - BBQ Hàn Quốc, vui vẻ cùng bạn bè",
  ],
  relaxation: [
    "Yoga tại nhà - Theo dõi video trên YouTube",
    "Nghe nhạc thư giãn - Spotify, Apple Music",
    "Đọc sách tại Fahasa hoặc thư viện",
    "Vẽ tranh, tô màu - Hoạt động nghệ thuật giảm stress",
  ],
}

export class ChatbotService {
  // Free user chatbot - only provides suggestions
  static getFreeUserResponse(userMessage: string): ChatbotResponse {
    const message = userMessage.toLowerCase()

    if (message.includes("cafe") || message.includes("cà phê") || message.includes("uống")) {
      return {
        message: "Đây là một số quán cà phê tuyệt vời để bạn thư giãn:",
        suggestions: FREE_USER_SUGGESTIONS.cafes,
      }
    }

    if (message.includes("đi chơi") || message.includes("hoạt động") || message.includes("làm gì")) {
      return {
        message: "Dưới đây là một số hoạt động giúp bạn giảm stress:",
        suggestions: FREE_USER_SUGGESTIONS.activities,
      }
    }

    if (message.includes("ăn") || message.includes("nhà hàng") || message.includes("quán")) {
      return {
        message: "Gợi ý một số địa điểm ăn uống tuyệt vời:",
        suggestions: FREE_USER_SUGGESTIONS.restaurants,
      }
    }

    if (message.includes("thư giãn") || message.includes("relax") || message.includes("nghỉ ngơi")) {
      return {
        message: "Một số hoạt động thư giãn bạn có thể thử:",
        suggestions: FREE_USER_SUGGESTIONS.relaxation,
      }
    }

    // Default response for free users
    return {
      message:
        "Xin chào! Tôi có thể gợi ý cho bạn các địa điểm và hoạt động giúp giảm stress. Hãy hỏi tôi về:\n\n• Quán cà phê\n• Hoạt động giải trí\n• Địa điểm ăn uống\n• Cách thư giãn\n\nNâng cấp lên Gold để trò chuyện sâu hơn về cảm xúc và tâm lý của bạn!",
      suggestions: ["Gợi ý quán cà phê", "Hoạt động giảm stress", "Địa điểm ăn uống", "Cách thư giãn"],
    }
  }

  // Gold user chatbot - full conversation support (mock)
  static async getGoldUserResponse(userMessage: string, conversationHistory: ChatMessage[]): Promise<ChatbotResponse> {
    // In production, this would call an AI API (OpenAI, Anthropic, etc.)
    // For now, we'll provide intelligent mock responses

    const message = userMessage.toLowerCase()

    // Emotional support responses
    if (message.includes("buồn") || message.includes("sad") || message.includes("khóc")) {
      return {
        message:
          "Tôi hiểu bạn đang cảm thấy buồn. Cảm xúc này là hoàn toàn bình thường và quan trọng là bạn đang chia sẻ nó. Bạn có muốn kể cho tôi nghe điều gì đang làm bạn buồn không? Đôi khi việc nói ra giúp chúng ta cảm thấy nhẹ nhàng hơn.",
        suggestions: ["Tôi muốn chia sẻ thêm", "Làm sao để bớt buồn?", "Tôi cần gặp bác sĩ"],
      }
    }

    if (message.includes("lo lắng") || message.includes("anxiety") || message.includes("걱정")) {
      return {
        message:
          "Lo lắng là một phản ứng tự nhiên của cơ thể. Hãy thử kỹ thuật hít thở sâu: Hít vào đếm 4, giữ 4 giây, thở ra đếm 4. Lặp lại 5 lần. Bạn có muốn tôi hướng dẫn thêm các kỹ thuật giảm lo lắng khác không?",
        suggestions: ["Hướng dẫn thêm kỹ thuật", "Tại sao tôi lo lắng?", "Khi nào cần gặp bác sĩ?"],
      }
    }

    if (message.includes("stress") || message.includes("căng thẳng") || message.includes("áp lực")) {
      return {
        message:
          "Stress kéo dài có thể ảnh hưởng đến sức khỏe. Một số cách giảm stress hiệu quả:\n\n1. Tập thể dục 30 phút/ngày\n2. Thiền hoặc yoga\n3. Dành thời gian cho sở thích\n4. Kết nối với người thân\n5. Ngủ đủ 7-8 tiếng\n\nBạn đã thử phương pháp nào chưa?",
        suggestions: ["Hướng dẫn thiền", "Bài tập thể dục", "Tôi muốn nói chuyện thêm"],
      }
    }

    if (message.includes("cảm ơn") || message.includes("thank")) {
      return {
        message:
          "Rất vui được hỗ trợ bạn! Hãy nhớ rằng việc chăm sóc sức khỏe tâm lý là một hành trình, không phải đích đến. Tôi luôn ở đây khi bạn cần. Bạn có muốn đặt lịch với bác sĩ tâm lý để được tư vấn chuyên sâu hơn không?",
        suggestions: ["Đặt lịch bác sĩ", "Tiếp tục trò chuyện", "Kết thúc"],
      }
    }

    if (message.includes("bác sĩ") || message.includes("doctor") || message.includes("tư vấn")) {
      return {
        message:
          "Việc tìm kiếm sự hỗ trợ từ chuyên gia là một quyết định tuyệt vời! Bác sĩ tâm lý có thể giúp bạn:\n\n• Hiểu rõ hơn về cảm xúc\n• Phát triển kỹ năng đối phó\n• Xây dựng lối sống lành mạnh\n• Điều trị các vấn đề tâm lý\n\nBạn có muốn đặt lịch hẹn không?",
        suggestions: ["Đặt lịch ngay", "Xem danh sách bác sĩ", "Tôi cần suy nghĩ thêm"],
      }
    }

    // Default conversational response
    return {
      message:
        "Tôi đang lắng nghe bạn. Là một trợ lý AI chăm sóc sức khỏe tâm lý, tôi có thể:\n\n• Lắng nghe và chia sẻ cảm xúc của bạn\n• Đưa ra các kỹ thuật giảm stress, lo lắng\n• Hướng dẫn các bài tập thư giãn\n• Gợi ý khi nào nên gặp bác sĩ\n\nBạn muốn nói về điều gì?",
      suggestions: ["Tôi cảm thấy buồn", "Tôi đang lo lắng", "Tôi bị stress", "Tôi muốn gặp bác sĩ"],
    }
  }
}
