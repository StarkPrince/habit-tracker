// src/app/register/page.tsx
'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register()
{
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault()
        setError('')

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError('All fields are required')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            await axios.post('/api/auth/register', { name, email, password })
            router.push('/login')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register')
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError('') }}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="John Doe"
                    />
                </label>
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
                <label className="block mb-2">
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="Confirm your password"
                    />
                </label>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    )
}
