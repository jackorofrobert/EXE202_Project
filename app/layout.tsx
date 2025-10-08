import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "EmoCare - Chăm sóc sức khỏe tâm lý",
  description: "Nền tảng chăm sóc sức khỏe tâm lý với chatbot AI và kết nối bác sĩ tâm lý",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} antialiased`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
