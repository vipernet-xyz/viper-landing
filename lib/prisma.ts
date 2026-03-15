import { PrismaClient } from '@prisma/client'
import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from 'fs'
import path from 'path'

const getEnvValue = (key: string) => {
    const proc = globalThis.process
    if (!proc || !proc.env) return undefined
    return proc.env[key]
}

const getEnvInt = (key: string, fallback: number) => {
    const raw = getEnvValue(key)
    if (!raw) return fallback
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : fallback
}

const tryLoadDatabaseUrlFromEnvFile = () => {
    if (getEnvValue('DATABASE_URL')) return
    try {
        let dir = process.cwd()
        let envPath: string | null = null
        for (let i = 0; i < 6; i += 1) {
            const candidate = path.join(dir, '.env')
            if (fs.existsSync(candidate)) {
                envPath = candidate
                break
            }
            const parent = path.dirname(dir)
            if (parent === dir) break
            dir = parent
        }
        if (!envPath) return

        const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
        for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('#')) continue
            if (!trimmed.startsWith('DATABASE_URL=')) continue
            let value = trimmed.split('=', 2)[1] || ''
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1)
            }
            if (value) {
                if (globalThis.process?.env) {
                    globalThis.process.env['DATABASE_URL'] = value
                }
            }
            break
        }
    } catch {
        // Best-effort only; fall back to dummy connection string.
    }
}

const prismaClientSingleton = () => {
    // During build time, DATABASE_URL might not be available
    // Use a dummy connection string for builds
    tryLoadDatabaseUrlFromEnvFile()
    const rawDatabaseUrl = getEnvValue('DATABASE_URL')
    const hasDatabaseUrl = Boolean(rawDatabaseUrl)
    const connectionString = (rawDatabaseUrl || 'postgresql://localhost:5432/dummy').replace(/^['"]|['"]$/g, '')

    if (process.env.NODE_ENV !== 'production') {
        let safeHost = 'missing'
        if (hasDatabaseUrl) {
            try {
                safeHost = new URL(connectionString).host
            } catch {
                safeHost = 'invalid'
            }
        }
        console.log(`[prisma] DATABASE_URL=${hasDatabaseUrl ? 'set' : 'missing'} host=${safeHost}`)
    }

    const isSupabasePooler = connectionString.includes('pooler.supabase.com')
    const defaultPoolMax = isSupabasePooler ? 5 : 20
    const poolMax = getEnvInt('PG_POOL_MAX', defaultPoolMax)
    const idleTimeoutMillis = getEnvInt('PG_POOL_IDLE_TIMEOUT_MS', 30000)
    const connectionTimeoutMillis = getEnvInt('PG_POOL_CONN_TIMEOUT_MS', 10000)

    const poolConfig: PoolConfig = {
        connectionString,
        ssl: hasDatabaseUrl ? { rejectUnauthorized: false } : false,
        // Connection pool settings
        max: poolMax, // Maximum number of clients in the pool
        idleTimeoutMillis, // Close idle clients after 30 seconds
        connectionTimeoutMillis, // Return an error after 10 seconds if connection could not be established
        // Retry logic
        allowExitOnIdle: true, // Allow the pool to close when all clients are idle
    }

    const pool = new Pool(poolConfig)

    // Add error handling for the pool
    pool.on('error', (err) => {
        console.error('Unexpected database pool error:', err)
    })

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
