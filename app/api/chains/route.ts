
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const chains = await prisma.chain.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        return NextResponse.json(chains)
    } catch (error) {
        console.error('Error fetching chains:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chains' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const chain = await prisma.chain.create({
            data: {
                name: body.name,
                description: body.description,
                icon: body.icon,
                status: body.status || 'active',
                type: body.type || 'tunnel'
            }
        })
        return NextResponse.json(chain)
    } catch (error) {
        console.error('Error creating chain:', error)
        return NextResponse.json(
            { error: 'Failed to create chain' },
            { status: 500 }
        )
    }
}
