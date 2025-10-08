import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  message: string
  isBot: boolean
  timestamp: Date
}

export function ChatMessageComponent({ message, isBot, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex gap-3 mb-4", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={cn("flex flex-col gap-1 max-w-[80%]", !isBot && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isBot ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {!isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
