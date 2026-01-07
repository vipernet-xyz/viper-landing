'use client'

import { Book, Code, Shield, Zap, ExternalLink, Coins, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DocumentationPage() {
    const docSections = [
        {
            title: 'Introduction',
            description: 'Learn about the RPC infrastructure problem and how Viper Network solves it',
            icon: Book,
            link: 'https://docs.vipernet.xyz/',
        },
        {
            title: 'Protocol Design',
            description: 'Understand the technical architecture including Pair, Service, and Finality',
            icon: Code,
            link: 'https://docs.vipernet.xyz/protocol/design',
        },
        {
            title: 'Economics',
            description: 'Learn about staking, rewards, and token burning mechanisms',
            icon: Coins,
            link: 'https://docs.vipernet.xyz/protocol/economics',
        },
        {
            title: 'Governance',
            description: 'Explore the decentralized governance structure of Viper Network',
            icon: Shield,
            link: 'https://docs.vipernet.xyz/protocol/governance',
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">Documentation</h2>
                <Button
                    onClick={() => window.open('https://docs.vipernet.xyz', '_blank')}
                    className="h-8 px-4 bg-white hover:bg-white/90 text-black text-xs font-medium rounded gap-2"
                >
                    View Full Docs
                    <ExternalLink className="h-3 w-3" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docSections.map((section) => (
                    <Card
                        key={section.title}
                        className="bg-viper-bg-card border-white/10 hover:border-white/20 transition-all cursor-pointer"
                        onClick={() => window.open(section.link, '_blank')}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-viper-purple to-viper-purple-dark flex items-center justify-center">
                                    <section.icon className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-white text-base font-medium">
                                    {section.title}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-white/60 text-sm">
                                {section.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-viper-bg-card border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-lg font-medium">Community & Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <a
                        href="https://discord.gg/viper"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <span className="text-white/80 text-sm">Join Discord</span>
                        <ExternalLink className="h-4 w-4 text-white/50" />
                    </a>
                    <a
                        href="https://x.com/viper_network_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <span className="text-white/80 text-sm">Follow on Twitter</span>
                        <ExternalLink className="h-4 w-4 text-white/50" />
                    </a>
                    <a
                        href="https://forms.gle/testnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <span className="text-white/80 text-sm">Join Testnet</span>
                        <ExternalLink className="h-4 w-4 text-white/50" />
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
