"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Calendar } from "lucide-react"
import type { Psychologist } from "@/types"

interface PsychologistCardProps {
  psychologist: Psychologist
  onBooking: (psychologistId: string) => void
}

export function PsychologistCard({ psychologist, onBooking }: PsychologistCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={psychologist.avatar || "/placeholder.svg"} alt={psychologist.name} />
            <AvatarFallback>{psychologist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{psychologist.name}</CardTitle>
            <CardDescription>{psychologist.title}</CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{psychologist.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({psychologist.reviewCount} đánh giá)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Chuyên môn</h4>
          <div className="flex flex-wrap gap-2">
            {psychologist.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Kinh nghiệm</h4>
          <p className="text-sm text-muted-foreground">{psychologist.experience}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Giới thiệu</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">{psychologist.bio}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-sm text-muted-foreground">Giá khám</p>
            <p className="text-lg font-bold">{psychologist.price.toLocaleString("vi-VN")}đ/buổi</p>
          </div>
          <Button onClick={() => onBooking(psychologist.id)}>
            <Calendar className="mr-2 h-4 w-4" />
            Đặt lịch
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
