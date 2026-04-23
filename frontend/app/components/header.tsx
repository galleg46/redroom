'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        {name: 'Home', link: '/'},
        {name: 'Events', link: '/events'},
        {name: 'About Us', link: '/about'},
        {name: 'Waiver', link: '/waiver'},
    ];

    return (
        <header className="bg-black top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

                {/* TOP ROW */}
                <div className="flex items-center justify-between md:justify-center">

                    {/* LOGO */}
                    <Link href="/" className="text-4xl md:text-6xl font-bold text-white text-center">
                        Red Room
                    </Link>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-red-700 transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                </div>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex justify-center gap-30 mt-10">
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