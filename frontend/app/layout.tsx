import type {Metadata} from "next";
import { Orbitron } from "next/font/google";
import "./ui/globals.css";
import Header from "@/app/components/header";
import {Box} from "@mui/material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import Footer from "@/app/components/footer";

const orbitron = Orbitron({
    variable: "--font-orbitron",
    subsets: ["latin"],
    display: "swap"
});

export const metadata: Metadata = {
    title: "Red Room",
    icons: {
      icon: "/redroom/favicon/RRFavicon.svg"
    },
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-black">
        <body className={`${orbitron.variable} antialiased`}>
        <AppRouterCacheProvider>
            <Box sx={{
                minHeight: "100vh",
                color: "white",
                backgroundImage: "linear-gradient(#000000 10%, #1a0000 20%, #4a0000 45%, #8b0000 100%)",
            }}>
                <Header/>
                <Box component="main" sx={{ flex: 1, pb: 6 }}>
                    {children}
                </Box>
                <Footer/>
            </Box>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
