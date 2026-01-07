import { PrismaClient } from '@prisma/client'
import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
    // During build time, DATABASE_URL might not be available
    // Use a dummy connection string for builds
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/dummy'
    const url = new URL(connectionString)

    const poolConfig: PoolConfig = {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1).split('?')[0],
        user: decodeURIComponent(url.username) || 'dummy',
        password: decodeURIComponent(url.password) || 'dummy',
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
    }

    const pool = new Pool(poolConfig)
    const adapter = new PrismaPg(pool)

    return new PrismaClient({
        adapter,
        log: ['error', 'warn']
    })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
