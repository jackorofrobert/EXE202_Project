import { FirestoreService } from './firestore-service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationService {
  private maxConversations = 20; // Giới hạn số conversation
  private maxMessagesPerConversation = 50; // Giới hạn số message per conversation

  async createConversation(userId: string, title?: string): Promise<Conversation> {
    const conversationData = {
      userId,
      title: title || `Cuộc trò chuyện ${new Date().toLocaleDateString('vi-VN')}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const docRef = await FirestoreService.createConversation(conversationData);
      return {
        id: docRef.id,
        ...conversationData,
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Không thể tạo cuộc trò chuyện mới');
    }
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const conversations = await FirestoreService.getUserConversations(userId);
      // Sort by updatedAt descending (newest first)
      return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      return await FirestoreService.getConversation(conversationId);
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  async addMessage(conversationId: string, message: ChatMessage): Promise<void> {
    try {
      // Retry logic for conversation not found
      let conversation = await this.getConversation(conversationId);
      if (!conversation) {
        // Wait a bit and try again (for newly created conversations)
        await new Promise(resolve => setTimeout(resolve, 1000));
        conversation = await this.getConversation(conversationId);
        if (!conversation) {
          throw new Error('Conversation not found');
        }
      }

      // Add new message
      conversation.messages.push(message);
      conversation.updatedAt = new Date();

      // Limit messages per conversation
      if (conversation.messages.length > this.maxMessagesPerConversation) {
        conversation.messages = conversation.messages.slice(-this.maxMessagesPerConversation);
      }

      await FirestoreService.updateConversation(conversationId, {
        messages: conversation.messages,
        updatedAt: conversation.updatedAt,
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw new Error('Không thể thêm tin nhắn');
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await FirestoreService.deleteConversation(conversationId);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Không thể xóa cuộc trò chuyện');
    }
  }

  async cleanupOldConversations(userId: string): Promise<void> {
    try {
      const conversations = await this.getConversations(userId);
      
      if (conversations.length > this.maxConversations) {
        // Delete oldest conversations
        const toDelete = conversations.slice(this.maxConversations);
        const deletePromises = toDelete.map(conv => this.deleteConversation(conv.id));
        await Promise.all(deletePromises);
      }
    } catch (error) {
      console.error('Error cleaning up conversations:', error);
    }
  }

  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    try {
      await FirestoreService.updateConversation(conversationId, {
        title,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw new Error('Không thể cập nhật tiêu đề');
    }
  }

  // Convert conversation messages to Gemini format
  convertToGeminiFormat(messages: ChatMessage[]): Array<{role: 'user' | 'model', parts: {text: string}[]}> {
    return messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
  }

  // Chỉ lấy user messages (câu hỏi) để gửi context
  getUserMessagesOnly(messages: ChatMessage[]): ChatMessage[] {
    return messages.filter(msg => msg.role === 'user');
  }

  // Convert user messages to context string
  convertUserMessagesToContext(messages: ChatMessage[]): string {
    const userMessages = this.getUserMessagesOnly(messages);
    return userMessages.map(msg => msg.content).join('\n');
  }
}
