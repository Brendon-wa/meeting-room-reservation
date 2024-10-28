import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./_components/header";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "./_components/footer";
import { ModalProvider } from "@/context/modal";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Meeting Rooms"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-between min-h-screen`}
        >
          <ModalProvider>
            <Header />
            {children}
            <Footer />
          </ModalProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
