"use client"

import type { Psychologist } from "../../types"

interface PsychologistCardProps {
  psychologist: Psychologist
  onBook: (psychologist: Psychologist) => void
}

export default function PsychologistCard({ psychologist, onBook }: PsychologistCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={psychologist.avatar || "/placeholder.svg"}
          alt={psychologist.name}
          className="w-20 h-20 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/caring-doctor.png"
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{psychologist.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{psychologist.specialization}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="text-accent">⭐</span>
              {psychologist.rating}
            </span>
            <span className="text-muted-foreground">{psychologist.experience} năm kinh nghiệm</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{psychologist.bio}</p>

      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${psychologist.available ? "text-secondary" : "text-muted-foreground"}`}>
          {psychologist.available ? "Đang hoạt động" : "Không khả dụng"}
        </span>
        <button
          onClick={() => onBook(psychologist)}
          disabled={!psychologist.available}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Đặt lịch
        </button>
      </div>
    </div>
  )
}
