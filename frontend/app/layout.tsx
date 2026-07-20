import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./ui/globals.css";
import Header from "@/app/components/header";
import {Box} from "@mui/material";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Red Room",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Box sx={{
            minHeight: "100vh",
            color: "white",
            backgroundImage: "linear-gradient(#000000 10%, #1a0000 20%, #4a0000 45%, #8b0000 100%)",
        }}>
            <Header />
            {children}
        </Box>
      </body>
    </html>
  );
}
