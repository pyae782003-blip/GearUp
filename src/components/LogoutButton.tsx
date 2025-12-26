'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/50 transition-all duration-200"
        >
            Logout
        </button>
    )
}
