# AI Configuration Guide

Hướng dẫn cấu hình AI models và system prompts cho EmoCare chatbot.

> **Lưu ý**: Code đã được tối ưu và sửa các lỗi Gemini API. Tất cả models và system prompts đều hoạt động ổn định.

## 📁 File Structure

```
src/lib/
├── ai-config.ts          # AI model configuration
├── system-prompts.ts     # System prompts for different contexts
├── gemini-service.ts     # Gemini AI service
└── chatbot-service.ts    # Main chatbot service
```

## 🤖 AI Models

### Available Models

| Model | Description | Speed | Quality | Use Case | Status |
|-------|-------------|-------|---------|----------|---------|
| `gemini-flash-latest` | Latest flash model | ⚡⚡⚡ | ⭐⭐⭐ | Default, fast chat | ✅ Working |
| `gemini-1.5-flash` | Stable flash model | ⚡⚡ | ⭐⭐⭐⭐ | Balanced performance | ✅ Working |
| `gemini-pro` | Pro model | ⚡ | ⭐⭐⭐⭐⭐ | High quality responses | ✅ Working |

### Configuration

Set model in `.env`:
```env
REACT_APP_AI_MODEL=gemini-flash-latest
```

## 🎯 System Prompts

### Context Types

1. **Main** (`EMOCARE_MAIN`)
   - Professional psychological support
   - Empathy and understanding
   - Stress management techniques
   - Used for: General mental health support

2. **Free** (`EMOCARE_FREE`)
   - Basic suggestions and tips
   - Location and activity recommendations
   - Upgrade prompts
   - Used for: Free tier users

3. **Crisis** (`EMOCARE_CRISIS`)
   - Emergency support
   - Safety prioritization
   - Professional help encouragement
   - Used for: Crisis situations

4. **Wellness** (`EMOCARE_WELLNESS`)
   - Lifestyle and health advice
   - Physical and mental activities
   - Work-life balance
   - Used for: General wellness topics

### Auto Context Detection

The system automatically selects appropriate prompts based on:

- **User Tier**: Free vs Gold
- **Message Content**: Crisis keywords detection (tự tử, tự hại, khủng hoảng)
- **Topic Analysis**: Wellness-related keywords (sức khỏe, tập thể dục, ăn uống)
- **Conversation History**: Context từ các tin nhắn trước đó

### Markdown Formatting

AI responses are automatically formatted with markdown for better readability:

- **Bold text** for headers and important points
- Numbered lists (1., 2., 3.) for steps or sequences
- Bullet points (-) for suggestions and tips
- Automatic line breaks and spacing

The `MarkdownText` component handles rendering of AI responses with proper formatting.

## 🔧 Usage Examples

### Basic Usage

```typescript
import { GeminiService } from './gemini-service';

const geminiService = new GeminiService(apiKey);
const response = await geminiService.generateResponse(
  userMessage,
  conversationHistory,
  userTier
);
```

### Custom Model

```typescript
const geminiService = new GeminiService(apiKey, 'gemini-pro');
```

### Manual System Prompt

```typescript
import { getSystemPrompt } from './system-prompts';

const crisisPrompt = getSystemPrompt('crisis');
```

## ⚙️ Configuration Options

### Model Parameters

```typescript
interface AIModelConfig {
  name: string;
  baseUrl: string;
  maxTokens: number;      // Response length limit
  temperature: number;    // Creativity (0-1)
  topK: number;          // Token selection diversity
  topP: number;          // Probability threshold
}
```

### Safety Settings

All models use consistent safety settings:
- Harassment: Block medium and above
- Hate speech: Block medium and above
- Sexually explicit: Block medium and above
- Dangerous content: Block medium and above

## 🚀 Best Practices

1. **Model Selection**:
   - Use `gemini-flash-latest` for fast responses
   - Use `gemini-pro` for complex psychological support
   - Monitor API costs and response times

2. **System Prompts**:
   - Let auto-detection handle context switching
   - Customize prompts for specific use cases
   - Test prompts with different user scenarios

3. **Error Handling**:
   - Implement fallback responses
   - Monitor API rate limits
   - Handle network timeouts gracefully

## 🔍 Troubleshooting

### Common Issues

1. **404 Model Not Found**:
   - ✅ **Fixed**: Model names đã được cập nhật đúng
   - ✅ **Fixed**: API endpoints đã được sửa
   - ✅ **Fixed**: Fallback model configuration

2. **Context Detection Issues**:
   - ✅ **Improved**: Keyword lists đã được cập nhật
   - ✅ **Improved**: Detection sensitivity đã được tối ưu
   - ✅ **Added**: Conversation history context

3. **Response Quality**:
   - ✅ **Optimized**: Temperature và topP parameters
   - ✅ **Enhanced**: System prompts cho better guidance
   - ✅ **Added**: Model-specific configurations

### Debug Mode (Optional)

Enable detailed logging for development:
```typescript
// Add to gemini-service.ts (development only)
console.log('Using model:', this.modelConfig.name);
console.log('System prompt context:', context);
console.log('User message:', userMessage);
```

> **Lưu ý**: Chỉ enable debug mode trong development. Trong production, tất cả console.log đã được loại bỏ để tối ưu performance.

## 📊 Performance Monitoring

Track these metrics:
- Response time per model (target: < 3 seconds)
- Token usage and costs (monitor daily limits)
- User satisfaction ratings (feedback system)
- Context detection accuracy (A/B testing)
- Error rates và retry attempts

## 🔄 Updates

To add new models or prompts:

1. **New Model**: Add to `AI_MODELS` in `ai-config.ts`
2. **New Prompt**: Add to `SYSTEM_PROMPTS` in `system-prompts.ts`
3. **New Context**: Update detection logic in `getContextualSystemPrompt`
4. **Testing**: Test với sample messages và user scenarios
5. **Deployment**: Deploy và monitor performance metrics

### Recent Updates (v1.2.0):
- ✅ Fixed Gemini API model names và endpoints
- ✅ Enhanced context detection với Vietnamese keywords
- ✅ Improved system prompts cho better responses
- ✅ Added conversation history context
- ✅ Optimized performance và error handling
- ✅ Removed console.log statements cho production

---

**EmoCare AI** - Intelligent mental health support powered by Gemini AI 🤖💚
