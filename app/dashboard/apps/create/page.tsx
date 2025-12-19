'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

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
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [allowedOrigins, setAllowedOrigins] = useState<string[]>([''])
    const [selectedChains, setSelectedChains] = useState<number[]>([])

    // Fetch available chains
    const { data: chains = [] } = useQuery<Chain[]>({
        queryKey: ['chains'],
        queryFn: async () => {
            const res = await fetch('/api/chains')
            if (!res.ok) throw new Error('Failed to fetch chains')
            return res.json()
        },
    })

    const mutation = useMutation({
        mutationFn: async (newApp: any) => {
            const res = await fetch('/api/apps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newApp),
            })

            if (!res.ok) {
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
            toast.error(error.message)
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

            <Card className="bg-zinc-900/50 border-zinc-800">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>App Details</CardTitle>
                        <CardDescription>
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
                                className="bg-zinc-950 border-zinc-800"
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
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                    {allowedOrigins.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeOriginField(index)}
                                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
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
                                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
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
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={mutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create App
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
