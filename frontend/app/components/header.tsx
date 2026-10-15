'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import {CustomButton} from "@/app/components/ui/CustomButton";
import LoginDialog from "@/app/components/auth/LoginDialog";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navLinks = [

        {name: 'Home', link: '/'},
        {name: 'Events', link: '/events'},
        {name: 'About Us', link: '/about'},
        {name: 'Waiver', link: '/waiver'},
    ];

    const handleOpenDialog = () => {
        setDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    return (
        <header className="bg-black top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

                {/* MOBILE TOP ROW */}
                <div className="flex items-center justify-between md:hidden">
                    <Link
                        href="/"
                        className="text-4xl font-bold text-white"
                    >
                        Red Room
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-300 hover:text-red-700 transition-colors"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* MOBILE SOCIALS */}
                <div className="flex items-center gap-4 mt-4 md:hidden">
                    <Link href="https://soundcloud.com/red-room-415516372" target="_blank">
                        <Image
                            src="/img-assets/SoundCloudIcon.webp"
                            alt="SoundCloud"
                            width={48}
                            height={48}
                        />
                    </Link>

                    <Link href="https://www.instagram.com/red_room_ofc/" target="_blank">
                        <InstagramIcon fontSize="large" />
                    </Link>

                    <Link href="https://www.facebook.com/profile.php?id=61586603220129" target="_blank">
                        <FacebookIcon fontSize="large" />
                    </Link>
                </div>

                {/* DESKTOP HEADER */}
                <div className="relative hidden md:block">
                    {/* DESKTOP LOGO */}
                    <div className="flex justify-center">
                        <Link
                            href="/"
                            className="text-6xl font-bold text-white"
                        >
                            Red Room
                        </Link>
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2">
                        {/* LOGIN BUTTON - TOP ROW */}
                        <CustomButton
                            sx={{
                                background: "transparent",
                                boxShadow: "none",
                                border: "none",
                                color: "white",
                                minWidth: "auto",
                                "&:hover": {
                                    backgroundColor: "transparent",
                                    boxShadow: "none",
                                    color: "#b91c1c",
                                },
                            }}
                            onClick={handleOpenDialog}
                        >Log in
                        </CustomButton>

                        <LoginDialog open={dialogOpen} setDialogOpen={setDialogOpen}/>

                        {/* DESKTOP SOCIAL ICONS - BOTTOM ROW */}
                        <div className="flex flex-row items-center gap-4">
                            <Link href="https://soundcloud.com/red-room-415516372" target="_blank">
                                <Image
                                    src="/img-assets/SoundCloudIcon.webp"
                                    alt="SoundCloud"
                                    width={48}
                                    height={48}
                                />
                            </Link>

                            <Link href="https://www.instagram.com/red_room_ofc/" target="_blank">
                                <InstagramIcon fontSize="large" />
                            </Link>

                            <Link href="https://www.facebook.com/profile.php?id=61586603220129" target="_blank">
                                <FacebookIcon fontSize="large" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex justify-center gap-30 mt-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.link}
                            className="text-3xl text-gray-300 hover:text-red-700 transition-colors duration-200 ease-in-out"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* MOBILE NAV */}
                {isOpen && (
                    <div className="md:hidden mt-4 border-t border-gray-500 pt-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.link}
                                className="block py-3 text-gray-300 hover:text-red-700 text-center"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}

            </nav>
        </header>
    )
}