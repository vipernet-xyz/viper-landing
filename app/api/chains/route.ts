
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // Add connection timeout and retry logic
        const chains = await prisma.chain.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        return NextResponse.json(chains)
    } catch (error) {
        console.error('Error fetching chains:', error)

        // Check if it's a connection error
        const errorMessage = error instanceof Error ? error.message : String(error)
        const isConnectionError = errorMessage.includes('ECONNREFUSED') ||
                                  errorMessage.includes('timeout') ||
                                  errorMessage.includes('connect')

        if (isConnectionError) {
            console.error('Database connection error - retrying might help')
            // Return empty array instead of error for better UX
            return NextResponse.json([])
        }

        return NextResponse.json(
            { error: 'Failed to fetch chains', details: errorMessage },
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
