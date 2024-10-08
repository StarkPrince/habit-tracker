'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { ReactNode } from 'react'

interface ModalProps
{
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    footer?: ReactNode
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps)
{
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Card className="w-full max-w-lg mx-4">
                <CardHeader className="relative">
                    <CardTitle>{title}</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
                {footer && (
                    <CardFooter>
                        {footer}
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}