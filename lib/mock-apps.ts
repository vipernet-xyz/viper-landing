export interface AppNetwork {
    id: number
    name: string
}

export interface AppMetrics {
    requests_24h: number | null
    failed_requests_24h: number | null
}

export interface AppData {
    id: number
    name: string
    description: string | null
    api_key: string
    created_at: string
    networks: AppNetwork[]
    metrics: AppMetrics
}

export const MOCK_APPS: AppData[] = [
    {
        id: 1,
        name: 'Starter App',
        description: 'Initial application for testing',
        api_key: 'vpr_1a2b3c4d5e6f7g8h9i0j',
        created_at: '2025-08-15T00:00:00Z',
        networks: [
            { id: 1, name: 'Ethereum' },
        ],
        metrics: {
            requests_24h: null,
            failed_requests_24h: null,
        },
    },
    {
        id: 2,
        name: 'Analytics App',
        description: 'Application for analytics tracking',
        api_key: 'vpr_2b3c4d5e6f7g8h9i0j1k',
        created_at: '2025-08-15T00:00:00Z',
        networks: [
            { id: 1, name: 'Ethereum' },
            { id: 5, name: 'Polygon' },
        ],
        metrics: {
            requests_24h: null,
            failed_requests_24h: null,
        },
    },
    {
        id: 3,
        name: 'App 3',
        description: 'Third application',
        api_key: 'vpr_3c4d5e6f7g8h9i0j1k2l',
        created_at: '2025-08-15T00:00:00Z',
        networks: [
            { id: 1, name: 'Ethereum' },
            { id: 5, name: 'Polygon' },
        ],
        metrics: {
            requests_24h: null,
            failed_requests_24h: null,
        },
    },
    {
        id: 4,
        name: 'App 4',
        description: 'Fourth application',
        api_key: 'vpr_4d5e6f7g8h9i0j1k2l3m',
        created_at: '2025-08-15T00:00:00Z',
        networks: [
            { id: 1, name: 'Ethereum' },
            { id: 5, name: 'Polygon' },
        ],
        metrics: {
            requests_24h: null,
            failed_requests_24h: null,
        },
    },
    {
        id: 5,
        name: 'App 5',
        description: 'Fifth application',
        api_key: 'vpr_5e6f7g8h9i0j1k2l3m4n',
        created_at: '2025-08-15T00:00:00Z',
        networks: [
            { id: 1, name: 'Ethereum' },
            { id: 5, name: 'Polygon' },
        ],
        metrics: {
            requests_24h: null,
            failed_requests_24h: null,
        },
    },
]