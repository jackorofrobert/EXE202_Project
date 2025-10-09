"use client";

import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { FirestoreService } from "../../lib/firestore-service";
import type { EmotionEntry, EmotionLevel } from "../../types";
import EmotionCheckModal from "../../components/user/emotion-check-modal";
import EmotionStatsChart from "../../components/user/emotion-stats-chart";
import SidebarNav from "../../components/user/sidebar-nav";
import QuickStats from "../../components/user/quick-stats";
import RecentEmotions from "../../components/user/recent-emotions";
import ChatbotPage from "./chatbot";
import BookingPage from "./booking";
import DiaryPage from "./diary";
import UpgradePage from "./upgrade";

function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [allEmotions, setAllEmotions] = useState<EmotionEntry[]>([]);
  const [showEmotionCheck, setShowEmotionCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEmotions();
  }, [user?.id]);

  const loadEmotions = async () => {
    if (!user?.id) {
      console.log("No user ID available");
      return;
    }
    
    console.log("Loading emotions for user:", user.id);
    setIsLoading(true);
    try {
      // Load tất cả emotions để check chính xác
      const allEmotionEntries = await FirestoreService.getEmotionEntries(user.id);
      console.log("Loaded emotions:", allEmotionEntries);
      setAllEmotions(allEmotionEntries);
      
      // Chỉ hiển thị 10 entries gần nhất trên dashboard
      const recentEmotions = allEmotionEntries.slice(0, 10);
      setEmotions(recentEmotions);
      
      // Check emotion sau khi đã load xong
      checkLastEmotionCheck(allEmotionEntries);
    } catch (error) {
      console.error("Error loading emotions:", error);
      // Fallback: set empty arrays
      setAllEmotions([]);
      setEmotions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLastEmotionCheck = (emotionsToCheck?: EmotionEntry[]) => {
    if (!user?.id) return;
    
    try {
      // Check if user has emotion entry today
      const today = new Date().toDateString();
      const emotions = emotionsToCheck || allEmotions;
      const hasTodayEmotion = emotions.some(emotion => 
        new Date(emotion.createdAt).toDateString() === today
      );
      
      if (!hasTodayEmotion) {
        setShowEmotionCheck(true);
      }
    } catch (error) {
      console.error("Error checking last emotion check:", error);
    }
  };

  const handleEmotionSubmit = async (level: EmotionLevel, note: string) => {
    if (!user?.id) return;

    // Check if user already has emotion entry today
    const today = new Date().toDateString();
    const hasTodayEmotion = allEmotions.some(emotion => 
      new Date(emotion.createdAt).toDateString() === today
    );
    
    if (hasTodayEmotion) {
      alert("Bạn đã ghi nhận cảm xúc hôm nay rồi. Hãy quay lại vào ngày mai!");
      return;
    }

    setIsLoading(true);
    try {
      const entryId = await FirestoreService.addEmotionEntry(user.id, {
        level,
        note,
      });

      const newEmotion: EmotionEntry = {
        id: entryId,
        userId: user.id,
        level,
        note,
        createdAt: new Date().toISOString(),
      };

      setEmotions([newEmotion, ...emotions]);
      setAllEmotions([newEmotion, ...allEmotions]);
      setShowEmotionCheck(false);
    } catch (error) {
      console.error("Error saving emotion entry:", error);
      alert("Có lỗi xảy ra khi lưu cảm xúc. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (emotions: EmotionEntry[]): number => {
    if (emotions.length === 0) return 0;
    
    // Sort emotions by date (newest first)
    const sortedEmotions = [...emotions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    
    // Check if user has emotion today
    const todayStr = today.toDateString();
    const hasToday = sortedEmotions.some(emotion => 
      new Date(emotion.createdAt).toDateString() === todayStr
    );
    
    if (!hasToday) {
      // If no emotion today, check yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      const hasYesterday = sortedEmotions.some(emotion => 
        new Date(emotion.createdAt).toDateString() === yesterdayStr
      );
      
      if (!hasYesterday) {
        return 0; // No streak if no emotion today or yesterday
      }
      
      // Start counting from yesterday
      streak = 1;
      today.setDate(today.getDate() - 1);
    } else {
      streak = 1;
    }
    
    // Count consecutive days backwards
    for (let i = 1; i < 365; i++) { // Max 365 days
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toDateString();
      
      const hasEmotionOnDate = sortedEmotions.some(emotion => 
        new Date(emotion.createdAt).toDateString() === checkDateStr
      );
      
      if (hasEmotionOnDate) {
        streak++;
      } else {
        break; // Streak broken
      }
    }
    
    return streak;
  };

  const streak = calculateStreak(allEmotions);

  const averageEmotion =
    allEmotions.length > 0
      ? allEmotions.reduce((sum, e) => sum + e.level, 0) / allEmotions.length
      : 0;

  return (
    <>
      <EmotionCheckModal
        isOpen={showEmotionCheck}
        onClose={() => setShowEmotionCheck(false)}
        onSubmit={handleEmotionSubmit}
      />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Xin chào, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Chúc bạn có một ngày tuyệt vời
          </p>
        </div>

        <QuickStats
          totalEmotions={allEmotions.length}
          averageEmotion={averageEmotion}
          streak={streak}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmotionStatsChart emotions={emotions} />
          <RecentEmotions emotions={emotions} />
        </div>

        {user?.tier === "free" && (
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-6 border border-accent/30">
            <h3 className="text-lg font-semibold mb-2">Nâng cấp lên Gold</h3>
            <p className="text-muted-foreground mb-4">
              Truy cập đầy đủ tính năng chatbot AI, đặt lịch và tư vấn với bác
              sĩ tâm lý chuyên nghiệp
            </p>
            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Nâng cấp ngay
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">EmoCare</h1>
          <p className="text-sm text-muted-foreground">
            {user?.tier === "gold" ? "Gold Member" : "Free Member"}
          </p>
        </div>
        <SidebarNav />
        <button
          onClick={logout}
          className="w-full mt-8 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Đăng xuất
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="diary" element={<DiaryPage />} />
          <Route path="upgrade" element={<UpgradePage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="profile" element={<div>Thông tin - Coming soon</div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
