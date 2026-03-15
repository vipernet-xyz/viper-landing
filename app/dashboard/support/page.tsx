'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Send } from 'lucide-react'

export default function SupportTicketPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        alert('Support ticket submitted successfully!')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-white" />
                <h2 className="text-xl font-medium text-white">Support Ticket</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ticket Form */}
                <div className="lg:col-span-2">
                    <Card className="bg-viper-bg-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-medium">Submit a Ticket</CardTitle>
                            <CardDescription className="text-white/60">
                                Need help? Submit a support ticket and our team will get back to you within 24 hours.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-white text-sm">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Brief description of your issue"
                                        className="bg-[#1c1b1b] border-white/10 text-white placeholder:text-white/40"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-white text-sm">Category</Label>
                                    <Select required>
                                        <SelectTrigger className="bg-[#1c1b1b] border-white/10 text-white">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="technical">Technical Issue</SelectItem>
                                            <SelectItem value="billing">Billing</SelectItem>
                                            <SelectItem value="account">Account</SelectItem>
                                            <SelectItem value="api">API Integration</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority" className="text-white text-sm">Priority</Label>
                                    <Select required>
                                        <SelectTrigger className="bg-[#1c1b1b] border-white/10 text-white">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-white text-sm">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Please provide detailed information about your issue..."
                                        className="bg-[#1c1b1b] border-white/10 text-white placeholder:text-white/40 min-h-[150px]"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-viper-purple hover:bg-viper-purple-dark text-white font-medium gap-2"
                                >
                                    {isSubmitting ? (
                                        'Submitting...'
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Submit Ticket
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Help Resources */}
                <div className="space-y-4">
                    <Card className="bg-viper-bg-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white text-base font-medium">Response Time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Critical</span>
                                <span className="text-white text-sm font-medium">2-4 hours</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">High</span>
                                <span className="text-white text-sm font-medium">8-12 hours</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Medium</span>
                                <span className="text-white text-sm font-medium">24 hours</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Low</span>
                                <span className="text-white text-sm font-medium">48 hours</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-viper-bg-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white text-base font-medium">Before You Submit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <a
                                href="https://docs.vipernet.xyz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 rounded hover:bg-white/5 transition-colors"
                            >
                                <span className="text-white/80 text-sm">View Documentation</span>
                            </a>
                            <a
                                href="https://discord.gg/viper"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 rounded hover:bg-white/5 transition-colors"
                            >
                                <span className="text-white/80 text-sm">Join Discord Community</span>
                            </a>
                            <a
                                href="https://x.com/viper_network_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 rounded hover:bg-white/5 transition-colors"
                            >
                                <span className="text-white/80 text-sm">Follow on Twitter</span>
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
