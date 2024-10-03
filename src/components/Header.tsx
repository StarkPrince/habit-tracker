'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Header: React.FC = () =>
{
    const { data: session } = useSession()

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between">
                <Link href="/">
                    <h1 className="text-2xl font-bold">Chain Breaker</h1>
                </Link>
                <div className="flex space-x-4">
                    {session ? (
                        <>
                            <Link href="/create" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 transition">
                                Create Habit
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-500 px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 transition">
                                Login
                            </Link>
                            <Link href="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-700 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
