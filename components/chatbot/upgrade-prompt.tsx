import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Sparkles } from "lucide-react"
import Link from "next/link"

export function UpgradePrompt() {
  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Nâng cấp lên Gold
        </CardTitle>
        <CardDescription>Mở khóa trò chuyện không giới hạn với AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
            <span>Trò chuyện sâu về cảm xúc và tâm lý</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
            <span>Nhận tư vấn và kỹ thuật giảm stress</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
            <span>Đặt lịch và chat với bác sĩ tâm lý</span>
          </div>
        </div>
        <Link href="/dashboard/upgrade">
          <Button className="w-full">
            <Crown className="mr-2 h-4 w-4" />
            Nâng cấp ngay - 299.000đ/tháng
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
