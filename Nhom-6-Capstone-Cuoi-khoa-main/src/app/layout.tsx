import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/main.scss";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CyberEdu | High Quality Tech Courses",
  description: "Join CyberEdu to master programming and technology. Professional courses from industry experts.",
  keywords: ["CyberEdu", "Programming", "Tech Courses", "E-learning", "React", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" style={{ zoom: 0.9 }}>
        <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { borderRadius: '0px', border: '2px solid #333', fontWeight: 'bold' } }} />
        <Header />
        <main className="pt-[80px] min-h-screen bg-gray-50 flex-grow main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
