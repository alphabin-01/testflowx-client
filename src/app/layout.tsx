import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { AuthProvider } from "@/components/auth/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ProjectProvider } from "@/contexts/project-context";
import { ApiKeyProvider } from "@/contexts/api-key-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - AB Test Report",
  description: "A dashboard for AB Test Reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ToastProvider />
          <DashboardProvider>
            <ProjectProvider>
              <ApiKeyProvider>
                <AuthGuard>
                  {children}
                </AuthGuard>
              </ApiKeyProvider>
            </ProjectProvider>
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
