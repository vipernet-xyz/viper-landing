'use client'

import { ChainProvider } from '@cosmos-kit/react'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import { wallets as leapWallets } from '@cosmos-kit/leap'
import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation'
import '@interchain-ui/react/styles'
import React from 'react'

export function CosmosProvider({ children }: { children: React.ReactNode }) {
    // Filter out any undefined wallets
    const allWallets = [
        ...(keplrWallets || []),
        ...(leapWallets || []),
        ...(cosmostationWallets || []),
    ].filter(Boolean)

    // Minimal chain configuration for Cosmos Hub only
    const minimalChains = [
        {
            chain_name: 'cosmoshub',
            chain_id: 'cosmoshub-4',
            pretty_name: 'Cosmos Hub',
            status: 'live' as const,
            network_type: 'mainnet' as const,
            bech32_prefix: 'cosmos',
            slip44: 118,
            chain_type: 'cosmos' as const,
            fees: {
                fee_tokens: [
                    {
                        denom: 'uatom',
                        fixed_min_gas_price: 0.005,
                        low_gas_price: 0.01,
                        average_gas_price: 0.025,
                        high_gas_price: 0.03,
                    },
                ],
            },
            staking: {
                staking_tokens: [
                    {
                        denom: 'uatom',
                    },
                ],
            },
            apis: {
                rpc: [
                    {
                        address: 'https://cosmos-rpc.polkachu.com/',
                    },
                ],
                rest: [
                    {
                        address: 'https://cosmos-api.polkachu.com/',
                    },
                ],
            },
        },
    ]

    const minimalAssets = [
        {
            chain_name: 'cosmoshub',
            assets: [
                {
                    description: 'The native staking token of the Cosmos Hub.',
                    denom_units: [
                        {
                            denom: 'uatom',
                            exponent: 0,
                        },
                        {
                            denom: 'atom',
                            exponent: 6,
                        },
                    ],
                    base: 'uatom',
                    name: 'Cosmos Hub Atom',
                    display: 'atom',
                    symbol: 'ATOM',
                    type_asset: 'sdk.coin' as const,
                },
            ],
        },
    ]

    return (
        <ChainProvider
            chains={minimalChains}
            assetLists={minimalAssets}
            wallets={allWallets}
            walletConnectOptions={{
                signClient: {
                    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
                    relayUrl: 'wss://relay.walletconnect.org',
                    metadata: {
                        name: 'Viper Network',
                        description: 'Viper Network - Multi-chain RPC Infrastructure',
                        url: typeof window !== 'undefined' ? window.location.origin : '',
                        icons: [typeof window !== 'undefined' ? `${window.location.origin}/icon.png` : ''],
                    },
                },
            }}
            throwErrors={false}
        // modalTheme={{ defaultTheme: 'dark' }} // modalTheme expects object, usually handled by interchain-ui styles
        >
            {children}
        </ChainProvider>
    )
}
