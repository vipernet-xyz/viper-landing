import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userIdCookie = cookieStore.get('viper_user_id')

        if (!userIdCookie || !userIdCookie.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = parseInt(userIdCookie.value)
        const { searchParams } = new URL(req.url)
        const appId = searchParams.get('app_id')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')
        const skip = (page - 1) * limit

        // Get user's apps to verify ownership
        const userApps = await prisma.app.findMany({
            where: { user_id: userId },
            select: { id: true }
        })

        const userAppIds = userApps.map(app => app.id)

        if (userAppIds.length === 0) {
            return NextResponse.json({
                analytics: {
                    total_requests_24h: 0,
                    failed_requests_24h: 0,
                    avg_response_time: 0,
                    requests_by_chain: []
                },
                relay_logs: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    total_pages: 0
                }
            })
        }

        // Filter by specific app if provided
        const appFilter = appId ? { app_id: parseInt(appId) } : { app_id: { in: userAppIds } }

        // Calculate 24h ago timestamp
        const twentyFourHoursAgo = new Date()
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

        // Get hourly data for charts (last 24 hours)
        const hourlyData: any[] = await prisma.$queryRaw`
            SELECT
                DATE_TRUNC('hour', created_at) as hour,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE success = true) as success,
                COUNT(*) FILTER (WHERE success = false) as failed
            FROM relay_logs
            WHERE app_id = ANY(${userAppIds}::int[])
                AND created_at >= ${twentyFourHoursAgo}
            GROUP BY DATE_TRUNC('hour', created_at)
            ORDER BY hour ASC
        `

        // Get analytics for the last 24 hours
        const [
            totalRequests24h,
            failedRequests24h,
            avgResponseTime,
            requestsByChain,
            relayLogs,
            totalLogs
        ] = await Promise.all([
            // Total requests in last 24h
            prisma.relayLog.count({
                where: {
                    ...appFilter,
                    created_at: { gte: twentyFourHoursAgo }
                }
            }),
            // Failed requests in last 24h
            prisma.relayLog.count({
                where: {
                    ...appFilter,
                    success: false,
                    created_at: { gte: twentyFourHoursAgo }
                }
            }),
            // Average response time in last 24h
            prisma.relayLog.aggregate({
                where: {
                    ...appFilter,
                    created_at: { gte: twentyFourHoursAgo }
                },
                _avg: {
                    response_time_ms: true
                }
            }),
            // Requests grouped by chain (top 5)
            prisma.relayLog.groupBy({
                by: ['chain_id'],
                where: {
                    ...appFilter,
                    created_at: { gte: twentyFourHoursAgo }
                },
                _count: {
                    id: true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                },
                take: 5
            }),
            // Paginated relay logs
            prisma.relayLog.findMany({
                where: appFilter,
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit,
                select: {
                    id: true,
                    app_id: true,
                    chain_id: true,
                    servicer_address: true,
                    request_type: true,
                    method: true,
                    response_time_ms: true,
                    success: true,
                    // session_height is BigInt - convert to string
                    session_height: true,
                    bytes_transferred: true,
                    geo_zone: true,
                    error_code: true,
                    created_at: true,
                    updated_at: true,
                    app: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            }),
            // Total count for pagination
            prisma.relayLog.count({
                where: appFilter
            })
        ])

        // Convert BigInt to string for JSON serialization
        const serializedLogs = relayLogs.map(log => ({
            ...log,
            session_height: log.session_height ? log.session_height.toString() : null
        }))

        // Format hourly data for charts
        const chartData = hourlyData.map(row => ({
            hour: row.hour,
            total: Number(row.total),
            success: Number(row.success),
            failed: Number(row.failed)
        }))

        return NextResponse.json({
            analytics: {
                total_requests_24h: totalRequests24h,
                failed_requests_24h: failedRequests24h,
                avg_response_time: Math.round(avgResponseTime._avg.response_time_ms || 0),
                requests_by_chain: requestsByChain.map(item => ({
                    chain_id: item.chain_id,
                    count: item._count.id
                })),
                hourly_data: chartData
            },
            relay_logs: serializedLogs,
            pagination: {
                page,
                limit,
                total: totalLogs,
                total_pages: Math.ceil(totalLogs / limit)
            }
        })
    } catch (error) {
        console.error('Analytics error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
