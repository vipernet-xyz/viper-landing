'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const { login, user, isLoading, web3auth } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user && !isLoading) {
            router.push('/dashboard')
        }
    }, [user, isLoading, router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />

            <Card className="w-[380px] border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Viper Network
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Connect your wallet to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8 pt-4">
                    <div className="relative w-24 h-24 mb-4">
                        {/* Placeholder for Logo or Animation */}
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                        <div className="relative z-10 w-full h-full flex items-center justify-center border border-indigo-500/30 rounded-full bg-black/50">
                            <span className="text-3xl">🚀</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-900/20"
                        size="lg"
                        onClick={login}
                        disabled={isLoading || !web3auth}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            'Connect Wallet'
                        )}
                    </Button>
                    <p className="text-xs text-center text-zinc-500">
                        By connecting, you agree to our Terms of Service
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
