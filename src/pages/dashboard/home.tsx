"use client";

import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import type { EmotionEntry, EmotionLevel } from "../../types";
import { mockEmotions } from "../../lib/mock-data";
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
  const [emotions, setEmotions] = useState<EmotionEntry[]>(mockEmotions);
  const [showEmotionCheck, setShowEmotionCheck] = useState(false);

  useEffect(() => {
    const lastCheck = localStorage.getItem("lastEmotionCheck");
    const today = new Date().toDateString();
    if (lastCheck !== today) {
      setShowEmotionCheck(true);
    }
  }, []);

  const handleEmotionSubmit = (level: EmotionLevel, note: string) => {
    const newEmotion: EmotionEntry = {
      id: Date.now().toString(),
      userId: user?.id || "",
      level,
      note,
      createdAt: new Date().toISOString(),
    };
    setEmotions([newEmotion, ...emotions]);
    localStorage.setItem("lastEmotionCheck", new Date().toDateString());
  };

  const averageEmotion =
    emotions.length > 0
      ? emotions.reduce((sum, e) => sum + e.level, 0) / emotions.length
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
          totalEmotions={emotions.length}
          averageEmotion={averageEmotion}
          streak={7}
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
