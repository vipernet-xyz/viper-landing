'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

export default function ActivityPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Activity Log</h2>
            <p className="text-zinc-400">View recent requests and usage statistics.</p>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2 gap-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    <CardTitle className="text-lg font-medium text-white">Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-500 text-sm border-2 border-dashed border-zinc-800 rounded-lg">
                        No activity recorded in the last 24 hours.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
