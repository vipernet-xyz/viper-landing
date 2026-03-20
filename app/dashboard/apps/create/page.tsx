'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, ArrowLeft, Plus, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth/AuthProvider'

interface Chain {
    id: number
    name: string
    description: string
    icon?: string
    status: string
    type: string
}

export default function CreateAppPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { user, isLoading } = useAuth()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [allowedOrigins, setAllowedOrigins] = useState<string[]>([''])
    const [selectedChains, setSelectedChains] = useState<number[]>([])

    // Check authentication
    useEffect(() => {
        if (!isLoading && !user) {
            toast.error('Please login to create apps', {
                description: 'You need to be authenticated to access this page'
            })
            router.push('/login')
        }
    }, [user, isLoading, router])

    // Fetch available chains
    const { data: chains = [], isError: chainsError } = useQuery<Chain[]>({
        queryKey: ['chains'],
        queryFn: async () => {
            const res = await fetch('/api/chains', { credentials: 'include' })
            if (!res.ok) {
                // If we get an error, return empty array for better UX
                console.warn('Failed to fetch chains, using empty array')
                return []
            }
            return res.json()
        },
        retry: 2,
        retryDelay: 1000,
    })

    const mutation = useMutation({
        mutationFn: async (newApp: any) => {
            const res = await fetch('/api/apps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newApp),
            })

            if (!res.ok) {
                // Handle authentication errors
                if (res.status === 401) {
                    toast.error('Authentication required', {
                        description: 'Please login to create apps'
                    })
                    router.push('/login')
                    throw new Error('Unauthorized')
                }

                const error = await res.json()
                throw new Error(error.error || 'Failed to create app')
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apps'] })
            toast.success('App created successfully!')
            router.push('/dashboard/apps')
        },
        onError: (error: Error) => {
            if (error.message !== 'Unauthorized') {
                toast.error(error.message)
            }
        },
    })

    const addOriginField = () => {
        setAllowedOrigins([...allowedOrigins, ''])
    }

    const removeOriginField = (index: number) => {
        const newOrigins = allowedOrigins.filter((_, i) => i !== index)
        setAllowedOrigins(newOrigins.length > 0 ? newOrigins : [''])
    }

    const updateOrigin = (index: number, value: string) => {
        const newOrigins = [...allowedOrigins]
        newOrigins[index] = value
        setAllowedOrigins(newOrigins)
    }

    const toggleChain = (chainId: number) => {
        setSelectedChains(prev =>
            prev.includes(chainId)
                ? prev.filter(id => id !== chainId)
                : [...prev, chainId]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        const filteredOrigins = allowedOrigins.filter(origin => origin.trim() !== '')

        // Convert numeric chain IDs to 4-digit string format (e.g., 1 -> "0001")
        const formattedChains = selectedChains.map(id => String(id).padStart(4, '0'))

        mutation.mutate({
            name,
            description,
            allowedOrigins: filteredOrigins,
            allowedChains: formattedChains,
        })
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" className="pl-0 hover:bg-transparent text-zinc-400 hover:text-white" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Apps
            </Button>

            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Create New App</h2>
                <p className="text-zinc-400">Generate a new API Key for your project</p>
            </div>

            <Card className="bg-[#111111] border-white/10 rounded-xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7f5ee3] to-[#46337d] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </div>
                        </div>
                        <CardTitle className="text-white text-lg">App Details</CardTitle>
                        <CardDescription className="text-white/50">
                            Enter the name and description for your application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">App Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., My DeFi Dashboard"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-white/40"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of your app..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Allowed Origins (Optional)</Label>
                            <p className="text-sm text-zinc-400">
                                Enter domains that can use this API key. Leave empty to allow all origins.
                            </p>
                            {allowedOrigins.map((origin, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com"
                                        value={origin}
                                        onChange={(e) => updateOrigin(index, e.target.value)}
                                        className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-white/40"
                                    />
                                    {allowedOrigins.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeOriginField(index)}
                                            className="bg-transparent border-white/20 text-white hover:bg-white/5"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addOriginField}
                                className="bg-transparent border-white/20 text-white hover:bg-white/5"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Origin
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <Label>Allowed Chains (Optional)</Label>
                            <p className="text-sm text-zinc-400">
                                Select blockchain networks this app can access. Leave empty to allow all chains.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {chains.map((chain) => (
                                    <div key={chain.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`chain-${chain.id}`}
                                            checked={selectedChains.includes(chain.id)}
                                            onCheckedChange={() => toggleChain(chain.id)}
                                        />
                                        <Label
                                            htmlFor={`chain-${chain.id}`}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {chain.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => router.back()} className="text-white/60 hover:text-white hover:bg-white/5">Cancel</Button>
                        <Button type="submit" disabled={mutation.isPending} className="bg-viper-purple hover:bg-viper-purple-dark text-white font-medium px-6">
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create App
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
