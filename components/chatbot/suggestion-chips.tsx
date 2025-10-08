"use client"

import { Button } from "@/components/ui/button"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <Button key={index} variant="outline" size="sm" onClick={() => onSelect(suggestion)} className="text-xs">
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
