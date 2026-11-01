import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "LaundryMate – Hostel Laundry Machine Occupancy Tracker",
  description: "Your hostel laundry, without the waiting. Check live washer availability and track cycles in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "rounded-xl border border-slate-200 font-sans shadow-lg",
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
