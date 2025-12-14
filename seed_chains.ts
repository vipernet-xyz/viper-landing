import { readFileSync } from 'fs'
import { PrismaClient } from '@prisma/client'
import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Load .env manually
const envContent = readFileSync('.env', 'utf8')
const envVars: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=["']?(.*)["']?$/)
    if (match) {
        envVars[match[1].trim()] = match[2].replace(/["']$/, '')
    }
})

// Parse connection string to handle special characters in password
const connectionString = envVars.DATABASE_URL || ''
const url = new URL(connectionString)

const poolConfig: PoolConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1).split('?')[0],
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: false }
}

const pool = new Pool(poolConfig)
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const chains = [
        {
            name: 'Ethereum',
            description: 'The decentralized L1',
            icon: '/assets/chains/ethereum.svg',
            status: 'active',
            type: 'tunnel'
        },
        {
            name: 'Solana',
            description: 'Fast, low-cost network for digital assets',
            icon: '/assets/chains/solana.svg',
            status: 'active',
            type: 'tunnel'
        },
        {
            name: 'Polygon',
            description: 'Low-fees, high-throughput',
            icon: '/assets/chains/polygon.svg',
            status: 'active',
            type: 'tunnel'
        },
        {
            name: 'Sui',
            description: 'Network with ease of web2',
            icon: '/assets/chains/sui.svg',
            status: 'active',
            type: 'tunnel'
        }
    ]

    console.log('Start seeding chains...')
    // Debug: check if model exists on client
    // @ts-ignore
    if (!prisma.chain) {
        throw new Error('Chain model not found on PrismaClient. Did you run prisma generate?')
    }

    for (const chain of chains) {
        // @ts-ignore
        const c = await prisma.chain.upsert({
            where: { name: chain.name },
            update: {},
            create: chain,
        })
        console.log(`Created chain with id: ${c.id}`)
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
