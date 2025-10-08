"use client"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export default function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm hover:bg-secondary/20 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
