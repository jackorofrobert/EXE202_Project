"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/auth-context";
import { FirestoreService } from "../../lib/firestore-service";
import type { DiaryEntry } from "../../types";

export default function DiaryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isLoading, setIsLoading] = useState(false);

  const loadDiaryEntries = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const diaryEntries = await FirestoreService.getDiaryEntries(user.id);
      setEntries(diaryEntries);
    } catch (error) {
      console.error("Error loading diary entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDiaryEntries();
  }, [loadDiaryEntries]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const entryId = await FirestoreService.addDiaryEntry(user.id, {
        title: title.trim(),
        content: content.trim(),
        mood,
      });

      const newEntry: DiaryEntry = {
        id: entryId,
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        mood,
        createdAt: new Date().toISOString(),
      };

      setEntries([newEntry, ...entries]);

      // Reset form
      setTitle("");
      setContent("");
      setMood(3);
      setIsWriting(false);
    } catch (error) {
      console.error("Error saving diary entry:", error);
      alert("Có lỗi xảy ra khi lưu nhật ký. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhật ký này?")) return;

    setIsLoading(true);
    try {
      await FirestoreService.deleteDiaryEntry(id);
      setEntries(entries.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      alert("Có lỗi xảy ra khi xóa nhật ký. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading && entries.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Nhật ký của tôi</h2>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

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
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
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
              disabled={isLoading}
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
                  disabled={isLoading}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
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
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isLoading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Đang lưu..." : "Lưu nhật ký"}
            </button>
            <button
              onClick={() => {
                setIsWriting(false);
                setTitle("");
                setContent("");
                setMood(3);
              }}
              disabled={isLoading}
              className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
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
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive/80 text-sm disabled:opacity-50"
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