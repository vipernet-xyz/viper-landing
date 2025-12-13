'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateAppPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        mutation.mutate({
            name,
            description,
            allowedOrigins: [], // Default to empty/all for now, can add UI later
            allowedChains: [],
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
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">App Name</Label>
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
