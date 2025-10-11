"use client";

import { useState, useEffect, useCallback } from "react";
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
import PaymentPage from "./payment";
import ChatPage from "./chat";
import UserProfile from "./profile";

function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [allEmotions, setAllEmotions] = useState<EmotionEntry[]>([]);
  const [showEmotionCheck, setShowEmotionCheck] = useState(false);

  const checkLastEmotionCheck = useCallback((emotionsToCheck?: EmotionEntry[]) => {
    if (!user?.id) return;
    
    try {
      // Check if user has emotion entry today
      const today = new Date().toDateString();
      const emotions = emotionsToCheck || allEmotions;
      const hasTodayEmotion = emotions.some(emotion => 
        new Date(emotion.createdAt).toDateString() === today
      );
      
      // Check if user has skipped today
      const skipKey = `emotion_skip_${user.id}`;
      const lastSkipDate = localStorage.getItem(skipKey);
      const hasSkippedToday = lastSkipDate === today;
      
      // Only show modal if user hasn't entered emotion AND hasn't skipped today
      if (!hasTodayEmotion && !hasSkippedToday) {
        setShowEmotionCheck(true);
      }
    } catch (error) {
      console.error("Error checking last emotion check:", error);
    }
  }, [user?.id, allEmotions]);

  const loadEmotions = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available");
      return;
    }
    
    console.log("Loading emotions for user:", user.id);
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
    }
  }, [user?.id, checkLastEmotionCheck]);

  useEffect(() => {
    loadEmotions();
  }, [loadEmotions]);

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
    }
  };

  const handleEmotionSkip = () => {
    if (!user?.id) return;
    
    // Save skip status to localStorage
    const today = new Date().toDateString();
    const skipKey = `emotion_skip_${user.id}`;
    localStorage.setItem(skipKey, today);
    
    // Close the modal
    setShowEmotionCheck(false);
    
    console.log("Emotion check skipped for today");
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
        onSkip={handleEmotionSkip}
      />

      <div className="space-y-8">
        <div className="pt-4">
          <h2 className="text-3xl font-bold mb-3">Xin chào, {user?.name}!</h2>
          <p className="text-muted-foreground text-lg">
            Chúc bạn có một ngày tuyệt vời
          </p>
        </div>

        <QuickStats
          totalEmotions={allEmotions.length}
          averageEmotion={averageEmotion}
          streak={streak}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          <div className="min-h-0">
            <EmotionStatsChart emotions={emotions} />
          </div>
          <div className="min-h-0">
            <RecentEmotions emotions={emotions} />
          </div>
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
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="flex-1 p-4">
          <SidebarNav />
          <div className="mt-4">
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="diary" element={<DiaryPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="upgrade" element={<UpgradePage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
