# E2E Test Matrix

This repo now has four Playwright lanes with different stability and infrastructure requirements.

## Test Lanes

### `pr-chromium`

Purpose:
- Fast PR gate
- Local-dev friendly
- No real third-party auth dependency

Runs:
- `e2e/frontend-smoke.spec.ts`
- `e2e/app-creation.spec.ts`
- `e2e/app-creation-with-auth.spec.ts`
- `e2e/browser-authenticated-flow.spec.ts`

Command:

```bash
pnpm test:e2e
```

### `nightly-chromium`

Purpose:
- Full local stack verification
- Includes the heavier dashboard CRUD regression suite

Runs:
- Everything in `pr-chromium`
- `e2e/browser-authenticated-relay.spec.ts`
- `e2e/dashboard-crud.spec.ts`

Command:

```bash
pnpm test:e2e:nightly
```

### `real-google-chromium`

Purpose:
- Real Google / Web3Auth smoke coverage
- Intended for headed local runs or a self-hosted nightly runner

Runs:
- `e2e/real-google.spec.ts`

Command:

```bash
E2E_REAL_GOOGLE_ENABLED=1 pnpm test:e2e:real-google
```

What it verifies:
- The Google button launches a real external provider flow
- A previously captured real Google auth state can hydrate `/dashboard`

What it does not do by default:
- Fully automate Google credentials entry
- Defeat CAPTCHA or anti-bot checks

### `real-cosmos-wallet-chromium`

Purpose:
- Real wallet-extension smoke coverage using a persistent Chromium profile
- Intended for headed local runs or a self-hosted nightly runner

Runs:
- `e2e/real-cosmos-wallet.spec.ts`

Command:

```bash
E2E_REAL_COSMOS_WALLET_ENABLED=1 pnpm test:e2e:real-wallet
```

What it verifies:
- The Cosmos wallet CTA launches a real extension approval UI
- If the profile is already connected and `E2E_COSMOS_EXPECTED_ADDRESS` is set, the app shows the expected wallet address

## Browser Relay Smoke

`e2e/browser-authenticated-relay.spec.ts` now lives in the nightly lane.

Why:
- It exercises the real dashboard relay UI
- It depends on the Go portal being reachable
- That makes it a poor default PR gate but a good nightly integration check

Optional variable:

`E2E_RELAY_HEALTHCHECK_URL`
- Defaults to `http://localhost:8000/health`
- Used by the nightly relay smoke test to decide whether the local relay backend is actually available

## Environment Variables

### Shared

`PLAYWRIGHT_BASE_URL`
- Optional
- Defaults to `http://localhost:3020`
- Set this to a staging URL if you want the real-provider projects to hit staging instead of booting a local dev server

`PLAYWRIGHT_WEB_SERVER_COMMAND`
- Optional
- Defaults to `pnpm dev`
- Used only when `PLAYWRIGHT_BASE_URL` points at local `http://localhost:3020`

### Real Google / Web3Auth

`E2E_REAL_GOOGLE_ENABLED=1`
- Enables `e2e/real-google.spec.ts`

`E2E_REAL_GOOGLE_STORAGE_STATE=./e2e/auth-state/google-user.json`
- Optional but recommended
- Path to a Playwright `storageState` file captured after a successful real Google login
- Required for the authenticated dashboard hydration check

### Real Cosmos Wallet

`E2E_REAL_COSMOS_WALLET_ENABLED=1`
- Enables `e2e/real-cosmos-wallet.spec.ts`

`E2E_COSMOS_WALLET_EXTENSION_PATH=/absolute/path/to/unpacked/extension`
- Required
- Path to the unpacked wallet extension directory

`E2E_COSMOS_WALLET_USER_DATA_DIR=./e2e/profiles/cosmos-wallet`
- Required
- Persistent Chromium profile directory that already has the test wallet imported

`E2E_COSMOS_EXPECTED_ADDRESS=cosmos1...`
- Optional
- If set, the wallet smoke test also checks that the connected address appears in the app

## Recommended Pipeline

### Pull Requests

Run:

```bash
pnpm test:e2e
```

Why:
- Fastest useful browser gate
- Avoids Google anti-bot instability
- Avoids browser-extension infrastructure in shared CI

### Nightly / Self-Hosted

Run:

```bash
pnpm test:e2e:nightly
```

Optional additions:

```bash
E2E_REAL_GOOGLE_ENABLED=1 pnpm test:e2e:real-google
E2E_REAL_COSMOS_WALLET_ENABLED=1 pnpm test:e2e:real-wallet
```

Why:
- Keeps PRs deterministic
- Still gives you real third-party smoke coverage on a controlled runner

## Capturing Real Google Storage State

One practical approach is:

1. Run a headed Playwright or Chrome session against `/login`
2. Complete the real Google login manually once
3. Save the resulting `storageState` to `e2e/auth-state/google-user.json`
4. Reuse that file for `real-google-chromium`

The repo ignores `e2e/auth-state/` by default so those files do not get committed.

## Capturing a Wallet Profile

One practical approach is:

1. Launch bundled Chromium with the wallet extension loaded
2. Import a dedicated test wallet into the extension
3. Store that browser profile under `e2e/profiles/cosmos-wallet`
4. Reuse that profile for `real-cosmos-wallet-chromium`

Use a dedicated test wallet only. Do not use a personal wallet or mainnet funds.

## Important Limitations

- Google may block sign-in in automated browsers. Real Google tests should be treated as smoke tests, not mandatory CI gates.
- Browser extension tests are most reliable on a local machine or self-hosted runner.
- The current app session route still needs real provider token verification to make external auth fully production-grade. Browser UX passing is not the same as server-side auth verification.

## Useful Commands

```bash
pnpm test:e2e
pnpm test:e2e:nightly
pnpm test:e2e:real-google
pnpm test:e2e:real-wallet
pnpm test:e2e:ui
pnpm test:e2e:debug
pnpm exec playwright show-report
```
