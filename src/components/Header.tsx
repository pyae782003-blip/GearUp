'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="border-b border-slate-200 backdrop-blur-sm bg-white/50 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-slate-300 transition-colors">
                            <Image
                                src="/logo.jpg"
                                alt="GearUp Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">GearUp</h1>
                            <p className="text-slate-500 text-xs hidden sm:block">Premium Creative Services</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="/#services" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                            Services
                        </a>
                        <Link
                            href="/track"
                            className="px-6 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-lg border border-slate-200 transition-all duration-200 hover:scale-105 shadow-sm font-medium"
                        >
                            Track Order
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden pt-4 pb-2 border-t border-slate-100 mt-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col space-y-4">
                            <a
                                href="/#services"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg hover:text-slate-900 font-medium"
                            >
                                Services
                            </a>
                            <Link
                                href="/track"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg hover:text-slate-900 font-medium"
                            >
                                Track Order
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
