import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/auth-context"
import ProtectedRoute from "./components/auth/protected-route"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import ForgotPasswordPage from "./pages/auth/forgot-password"
import ChangePasswordPage from "./pages/auth/change-password"
import LandingPage from "./pages/landing"
import AdminDashboard from "./pages/admin/dashboard"
import UserDashboard from "./pages/dashboard/home"
import PsychologistDashboard from "./pages/psychologist/dashboard"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "psychologist"]}>
              <ChangePasswordPage />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/psychologist/*"
          element={
            <ProtectedRoute allowedRoles={["psychologist"]}>
              <PsychologistDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
