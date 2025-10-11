import type { UserTier } from "../types";
import { GeminiService } from './gemini-service';
import { ConversationService, type ChatMessage } from './conversation-service';

interface ChatbotResponse {
  message: string;
  suggestions?: string[];
}

const freeUserSuggestions = {
  cafes: [
    "☕ The Coffee House - Không gian yên tĩnh, view đẹp, phù hợp đọc sách",
    "☕ Highlands Coffee - Chi nhánh nhiều, tiện lợi, wifi tốt",
    "☕ Phúc Long Coffee & Tea - Không gian xanh mát, đồ uống healthy",
    "☕ Cộng Cà Phê - Phong cách hoài cổ, âm nhạc nhẹ nhàng",
  ],
  activities: [
    "🚶 Đi dạo công viên Tao Đàn - Không khí trong lành, tập thể dục nhẹ (6h-18h)",
    "🎬 Xem phim cùng bạn bè - CGV, Lotte Cinema - Giải trí và kết nối",
    "🧘 Tham gia lớp yoga miễn phí - Công viên Lê Văn Tám (Sáng CN)",
    "🛍️ Đi chợ đêm Bến Thành - Khám phá ẩm thực và văn hóa địa phương",
    "🎨 Tham quan bảo tàng - Bảo tàng Mỹ thuật, Bảo tàng Lịch sử (Miễn phí)",
  ],
  restaurants: [
    "🍜 Quán Bụi - Món Việt truyền thống, không gian ấm cúng (150k-300k/người)",
    "🍕 Pizza 4P's - Pizza ngon, không gian hiện đại (200k-400k/người)",
    "🍚 Cơm Tấm Mộc - Món ăn bình dân, giá cả phải chăng (50k-100k/người)",
    "🥗 Wrap & Roll - Món Việt healthy, phù hợp ăn nhẹ (100k-200k/người)",
  ],
  entertainment: [
    "🎮 Khu vui chơi Timezone - Game arcade, bowling (100k-300k)",
    "📚 Thư viện Sách - Không gian đọc sách yên tĩnh, miễn phí",
    "🎤 Karaoke cùng bạn bè - Giải tỏa cảm xúc qua âm nhạc",
    "🏊 Bơi lội - Hồ bơi công cộng, tốt cho sức khỏe (30k-50k)",
  ],
};

export class ChatbotService {
  private userTier: UserTier;
  private userId: string;
  private geminiService: GeminiService;
  private conversationService: ConversationService;
  private currentConversationId: string | null = null;

  constructor(userTier: UserTier, userId: string, geminiApiKey: string) {
    this.userTier = userTier;
    this.userId = userId;
    this.geminiService = new GeminiService(geminiApiKey);
    this.conversationService = new ConversationService();
  }

  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      // Create new conversation if none exists
      if (!this.currentConversationId) {
        const conversation = await this.conversationService.createConversation(this.userId);
        this.currentConversationId = conversation.id;
      }

      // Add user message to conversation
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      try {
        await this.conversationService.addMessage(this.currentConversationId, userMessage);
      } catch (error) {
        // If adding message fails, create a new conversation
        const newConversation = await this.conversationService.createConversation(this.userId);
        this.currentConversationId = newConversation.id;
        
        // Try adding message again
        await this.conversationService.addMessage(this.currentConversationId, userMessage);
      }

      // Get conversation history
      const conversation = await this.conversationService.getConversation(this.currentConversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Convert to Gemini format
      const geminiHistory = this.conversationService.convertToGeminiFormat(conversation.messages.slice(0, -1)); // Exclude current message

      // Generate response using Gemini
      const aiResponse = await this.geminiService.generateResponse(
        message,
        geminiHistory,
        this.userTier
      );

      // Add AI response to conversation
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      await this.conversationService.addMessage(this.currentConversationId, aiMessage);

      // Update conversation title if it's the first message
      if (conversation.messages.length === 1) {
        const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
        await this.conversationService.updateConversationTitle(this.currentConversationId, title);
      }

      // Cleanup old conversations
      await this.conversationService.cleanupOldConversations(this.userId);

      return {
        message: aiResponse,
        suggestions: this.getSuggestions(),
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Fallback to old system for free users
      if (this.userTier === 'free') {
        return this.getFreeUserResponse(message);
      }
      
      throw new Error('Không thể kết nối với AI. Vui lòng thử lại sau.');
    }
  }

  async getConversations() {
    return await this.conversationService.getConversations(this.userId);
  }

  async switchConversation(conversationId: string) {
    this.currentConversationId = conversationId;
  }

  async deleteConversation(conversationId: string) {
    await this.conversationService.deleteConversation(conversationId);
    if (this.currentConversationId === conversationId) {
      this.currentConversationId = null;
    }
  }

  async createNewConversation() {
    this.currentConversationId = null;
  }

  private getSuggestions(): string[] {
    if (this.userTier === 'free') {
      return [
        "☕ Quán cà phê",
        "🍽️ Nhà hàng", 
        "🎯 Hoạt động giải trí",
        "💆 Giảm stress",
      ];
    } else {
      return [
        "💭 Tôi đang cảm thấy stress",
        "😔 Tôi cảm thấy buồn",
        "😰 Tôi lo lắng",
        "🧘 Kỹ thuật thư giãn",
      ];
    }
  }

  private getFreeUserResponse(message: string): ChatbotResponse {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("cafe") ||
      lowerMessage.includes("cà phê") ||
      lowerMessage.includes("quán")
    ) {
      return {
        message:
          "☕ Đây là những quán cà phê yên tĩnh, lý tưởng để thư giãn và suy ngẫm:",
        suggestions: freeUserSuggestions.cafes,
      };
    }

    if (
      lowerMessage.includes("ăn") ||
      lowerMessage.includes("nhà hàng") ||
      lowerMessage.includes("quán ăn")
    ) {
      return {
        message: "🍽️ Gợi ý một số địa điểm ăn uống tuyệt vời cho bạn:",
        suggestions: freeUserSuggestions.restaurants,
      };
    }

    if (
      lowerMessage.includes("chơi") ||
      lowerMessage.includes("hoạt động") ||
      lowerMessage.includes("giải trí")
    ) {
      return {
        message: "🎯 Các hoạt động giải trí giúp bạn thư giãn và kết nối:",
        suggestions: freeUserSuggestions.entertainment,
      };
    }

    if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("căng thẳng")
    ) {
      return {
        message:
          "💆 Một số hoạt động giúp giảm stress hiệu quả mà bạn có thể thử:",
        suggestions: freeUserSuggestions.activities,
      };
    }

    if (lowerMessage.includes("bạn bè") || lowerMessage.includes("cùng nhau")) {
      return {
        message: "👥 Các hoạt động tuyệt vời để làm cùng bạn bè:",
        suggestions: [
          "🎬 Xem phim và thảo luận sau đó",
          "🍕 Đi ăn và trò chuyện tại Pizza 4P's",
          "🎮 Chơi game tại Timezone",
          "🚶 Đi dạo và picnic tại công viên",
        ],
      };
    }

    return {
      message:
        "Xin chào! 👋 Tôi có thể gợi ý cho bạn các địa điểm ăn uống, quán cà phê và hoạt động giải trí để giảm stress. Bạn muốn tìm hiểu về điều gì?",
      suggestions: [
        "☕ Quán cà phê",
        "🍽️ Nhà hàng",
        "🎯 Hoạt động giải trí",
        "💆 Giảm stress",
      ],
    };
  }

  private getGoldUserResponse(message: string): ChatbotResponse {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("căng thẳng")
    ) {
      return {
        message:
          "Tôi hiểu bạn đang cảm thấy căng thẳng. 💙 Đây là một số kỹ thuật giúp bạn:\n\n" +
          "🫁 **Hít thở 4-7-8**: Hít vào 4 giây, giữ 7 giây, thở ra 8 giây. Lặp lại 4 lần.\n\n" +
          "🧘 **Thư giãn cơ bắp**: Căng và thả lỏng từng nhóm cơ, từ đầu đến chân.\n\n" +
          "📝 **Viết nhật ký**: Ghi lại cảm xúc giúp giải tỏa và nhận thức rõ hơn.\n\n" +
          "Bạn có muốn chia sẻ thêm về điều gì đang làm bạn căng thẳng không?",
        suggestions: [
          "Tôi muốn nói chuyện thêm",
          "Kỹ thuật khác",
          "Đặt lịch với bác sĩ",
        ],
      };
    }

    if (
      lowerMessage.includes("buồn") ||
      lowerMessage.includes("trầm cảm") ||
      lowerMessage.includes("lo âu")
    ) {
      return {
        message:
          "Cảm ơn bạn đã tin tưởng chia sẻ với tôi. 💙 Cảm xúc buồn là điều hoàn toàn bình thường và quan trọng là bạn đã nhận ra nó.\n\n" +
          "Một số điều có thể giúp bạn:\n" +
          "• Cho phép bản thân cảm nhận, không tự trách mình\n" +
          "• Kết nối với người thân, bạn bè\n" +
          "• Tham gia hoạt động nhẹ nhàng như đi dạo\n" +
          "• Viết nhật ký để thể hiện cảm xúc\n\n" +
          "Bạn có muốn nói về điều gì đang khiến bạn cảm thấy như vậy không?",
        suggestions: [
          "Tôi muốn chia sẻ thêm",
          "Làm sao để cải thiện?",
          "Liên hệ bác sĩ tâm lý",
        ],
      };
    }

    if (lowerMessage.includes("ngủ") || lowerMessage.includes("mất ngủ")) {
      return {
        message:
          "Vấn đề về giấc ngủ có thể ảnh hưởng lớn đến sức khỏe tâm lý. 😴 Một số gợi ý:\n\n" +
          "🌙 **Trước khi ngủ (1-2 giờ)**:\n" +
          "• Tránh màn hình điện tử\n" +
          "• Uống trà thảo mộc (hoa cúc, lavender)\n" +
          "• Đọc sách nhẹ nhàng\n" +
          "• Thiền hoặc nghe nhạc thư giãn\n\n" +
          "⏰ **Thói quen**:\n" +
          "• Ngủ và thức dậy cùng giờ mỗi ngày\n" +
          "• Giữ phòng mát, tối và yên tĩnh\n" +
          "• Tránh caffeine sau 14h\n\n" +
          "Bạn thường gặp khó khăn gì khi ngủ?",
        suggestions: [
          "Khó đi vào giấc ngủ",
          "Thức giấc giữa đêm",
          "Tư vấn chuyên sâu",
        ],
      };
    }

    if (
      lowerMessage.includes("lo lắng") ||
      lowerMessage.includes("anxiety") ||
      lowerMessage.includes("sợ")
    ) {
      return {
        message:
          "Tôi hiểu cảm giác lo lắng có thể rất khó chịu. 💙 Hãy thử kỹ thuật **Grounding 5-4-3-2-1**:\n\n" +
          "👀 Nhìn 5 thứ xung quanh bạn\n" +
          "✋ Chạm vào 4 thứ khác nhau\n" +
          "👂 Nghe 3 âm thanh\n" +
          "👃 Ngửi 2 mùi hương\n" +
          "👅 Nếm 1 thứ gì đó\n\n" +
          "Kỹ thuật này giúp bạn tập trung vào hiện tại và giảm lo âu. Bạn có muốn thử ngay không?",
        suggestions: [
          "Tôi đã thử rồi",
          "Kỹ thuật khác",
          "Nói chuyện với bác sĩ",
        ],
      };
    }

    if (
      lowerMessage.includes("mối quan hệ") ||
      lowerMessage.includes("gia đình") ||
      lowerMessage.includes("bạn bè") ||
      lowerMessage.includes("người yêu")
    ) {
      return {
        message:
          "Mối quan hệ là một phần quan trọng trong cuộc sống. 💕 Một số gợi ý:\n\n" +
          "🗣️ **Giao tiếp**: Chia sẻ cảm xúc một cách chân thành và lắng nghe\n" +
          "🤝 **Đồng cảm**: Cố gắng hiểu góc nhìn của người khác\n" +
          "⏸️ **Ranh giới**: Biết khi nào cần không gian riêng\n" +
          "💬 **Giải quyết xung đột**: Tập trung vào vấn đề, không công kích cá nhân\n\n" +
          "Bạn muốn chia sẻ về mối quan hệ nào đang khiến bạn băn khoăn?",
        suggestions: ["Gia đình", "Bạn bè", "Người yêu", "Đồng nghiệp"],
      };
    }

    if (
      lowerMessage.includes("động lực") ||
      lowerMessage.includes("mục tiêu") ||
      lowerMessage.includes("không muốn làm gì")
    ) {
      return {
        message:
          "Mất động lực là điều bình thường, đặc biệt khi bạn đang mệt mỏi. 🌱\n\n" +
          "**Một số cách lấy lại động lực**:\n" +
          "• Chia mục tiêu lớn thành các bước nhỏ\n" +
          "• Tự thưởng cho bản thân khi hoàn thành\n" +
          "• Tìm lại lý do ban đầu (Why)\n" +
          "• Nghỉ ngơi khi cần thiết - đó không phải yếu đuối\n" +
          "• Kết nối với người có cùng mục tiêu\n\n" +
          "Bạn đang cố gắng đạt được điều gì?",
        suggestions: ["Công việc", "Học tập", "Sức khỏe", "Mối quan hệ"],
      };
    }

    return {
      message:
        "Xin chào! 💙 Tôi là trợ lý AI của EmoCare. Tôi ở đây để lắng nghe và hỗ trợ bạn về các vấn đề sức khỏe tâm lý.\n\n" +
        "Bạn có thể chia sẻ với tôi về:\n" +
        "• Cảm xúc và tâm trạng hiện tại\n" +
        "• Các vấn đề đang gặp phải\n" +
        "• Kỹ thuật thư giãn và quản lý stress\n" +
        "• Mối quan hệ và giao tiếp\n\n" +
        "Tôi sẽ lắng nghe và hỗ trợ bạn. Bạn muốn chia sẻ điều gì hôm nay?",
      suggestions: [
        "💭 Tôi đang cảm thấy stress",
        "😔 Tôi cảm thấy buồn",
        "😰 Tôi lo lắng",
        "🧘 Kỹ thuật thư giãn",
      ],
    };
  }
}
