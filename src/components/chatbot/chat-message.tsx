import { MarkdownText } from "../ui/markdown-text";

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp: Date | string | null
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  const formatTimestamp = (timestamp: Date | string | null): string => {
    if (!timestamp) return "Vừa xong";
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Vừa xong";
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      return "Vừa xong";
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message}</p>
          ) : (
            <MarkdownText text={message} className="text-sm leading-relaxed" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  )
}
