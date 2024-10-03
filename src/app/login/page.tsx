// src/app/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login()
{
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault()
        setError('')
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        if (res?.error) {
            setError(res.error)
        } else {
            router.push('/')
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="jsmith@example.com"
                    />
                </label>
                <label className="block mb-2">
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="Your password"
                    />
                </label>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
