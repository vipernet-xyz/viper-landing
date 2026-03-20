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
        <div className="max-w-2xl mx-auto space-y-4">
            <Button variant="ghost" className="pl-0 h-8 hover:bg-transparent text-white/40 hover:text-white text-sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Apps
            </Button>

            <div>
                <h2 className="text-2xl font-semibold text-white">Create New App</h2>
                <p className="text-white/40 text-sm mt-0.5">Generate a new API Key for your project</p>
            </div>

            <Card className="bg-[#111111] border-white/10 rounded-xl">
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-6">
                        {/* App Name + Description side by side */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-[13px]">App Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., My DeFi Dashboard"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-9 bg-[#0a0a0a] border-white/10 text-white placeholder:text-white/40 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-[13px]">Description (Optional)</Label>
                                <Input
                                    id="description"
                                    placeholder="Brief description of your app..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="h-9 bg-[#0a0a0a] border-white/10 text-white placeholder:text-white/40 text-sm"
                                />
                            </div>
                        </div>

                        {/* Allowed Origins */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-[13px]">Allowed Origins (Optional)</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={addOriginField}
                                    className="h-7 px-2 text-white/40 hover:text-white text-xs"
                                >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add
                                </Button>
                            </div>
                            {allowedOrigins.map((origin, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com"
                                        value={origin}
                                        onChange={(e) => updateOrigin(index, e.target.value)}
                                        className="h-9 bg-[#0a0a0a] border-white/10 text-white placeholder:text-white/40 text-sm"
                                    />
                                    {allowedOrigins.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeOriginField(index)}
                                            className="h-9 w-9 bg-transparent border-white/10 text-white/40 hover:bg-white/5 hover:text-white shrink-0"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Allowed Chains */}
                        {chains.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-[13px]">Allowed Chains (Optional)</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {chains.map((chain) => (
                                        <div key={chain.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`chain-${chain.id}`}
                                                checked={selectedChains.includes(chain.id)}
                                                onCheckedChange={() => toggleChain(chain.id)}
                                            />
                                            <Label
                                                htmlFor={`chain-${chain.id}`}
                                                className="text-[13px] font-normal cursor-pointer"
                                            >
                                                {chain.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 pb-5">
                        <Button type="button" variant="ghost" onClick={() => router.back()} className="h-9 text-white/50 hover:text-white hover:bg-white/5 text-sm">Cancel</Button>
                        <Button type="submit" disabled={mutation.isPending} className="h-9 bg-viper-purple hover:bg-viper-purple-dark text-white font-medium px-6 text-sm">
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create App
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
