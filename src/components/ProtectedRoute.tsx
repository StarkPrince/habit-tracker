// src/components/ProtectedRoute.tsx
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'; // Add this line

interface ProtectedRouteProps
{
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) =>
{
    const { data: session, status } = useSession()
    const router = useRouter()

    React.useEffect(() =>
    {
        if (status === 'loading') return // Do nothing while loading
        if (!session) router.push('/login') // Redirect if not authenticated
    }, [session, status, router])

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    return <>{children}</>
}

export default ProtectedRoute
