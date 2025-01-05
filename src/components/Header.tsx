'use client'

import { Button } from "@/components/ui/button"
import { Unlink } from "lucide-react"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { ModeToggle } from "./ui/mode-toggle"

const Header: React.FC = () =>
{
    const { data: session } = useSession()

    return (
        <header className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity flex items-center">
                    <Unlink className="mr-2 h-6 w-6" />
                    Chain Breaker
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <ModeToggle />
                        {session ? (
                            <>
                                <li>
                                    <Button asChild variant="secondary">
                                        <Link href="/create">Create Habit</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button variant="destructive" onClick={() => signOut()}>
                                        Logout
                                    </Button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Button asChild variant="secondary">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="default">
                                        <Link href="/register">Register</Link>
                                    </Button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header