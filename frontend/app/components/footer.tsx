"use client";

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full border-t border-red-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400">
                    <Link
                        href="/tc"
                        className="hover:text-white transition-colors"
                    >
                        Terms & Conditions
                    </Link>

                    <Link
                        href="/privacy"
                        className="hover:text-white transition-colors"
                    >
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
}