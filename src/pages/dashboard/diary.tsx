"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import type { DiaryEntry } from "../../types";

export default function DiaryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);

  useEffect(() => {
    // Load diary entries from localStorage
    const saved = localStorage.getItem(`diary_${user?.id}`);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, [user?.id]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      userId: user?.id || "",
      title,
      content,
      mood,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(`diary_${user?.id}`, JSON.stringify(updated));

    // Reset form
    setTitle("");
    setContent("");
    setMood(3);
    setIsWriting(false);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(`diary_${user?.id}`, JSON.stringify(updated));
  };

  const moodEmojis = {
    1: "😢",
    2: "😕",
    3: "😐",
    4: "🙂",
    5: "😊",
  };

  const moodLabels = {
    1: "Rất tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Rất tốt",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nhật ký của tôi</h2>
          <p className="text-muted-foreground">
            Ghi lại cảm xúc và suy nghĩ của bạn
          </p>
        </div>
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Viết nhật ký mới
          </button>
        )}
      </div>

      {isWriting && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề..."
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tâm trạng hôm nay
            </label>
            <div className="flex gap-4">
              {([1, 2, 3, 4, 5] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setMood(level)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    mood === level
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{moodEmojis[level]}</span>
                  <span className="text-xs">{moodLabels[level]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nội dung</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết về ngày hôm nay của bạn..."
              rows={8}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Lưu nhật ký
            </button>
            <button
              onClick={() => {
                setIsWriting(false);
                setTitle("");
                setContent("");
                setMood(3);
              }}
              className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              Chưa có nhật ký nào. Hãy bắt đầu viết nhật ký đầu tiên của bạn!
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-card rounded-lg border border-border p-6 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-destructive hover:text-destructive/80 text-sm"
                >
                  Xóa
                </button>
              </div>
              <p className="text-foreground whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
