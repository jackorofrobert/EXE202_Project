interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp: Date
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}
