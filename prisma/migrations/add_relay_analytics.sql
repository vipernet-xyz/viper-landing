-- Migration: Add relay analytics tables
-- Run this in Supabase SQL Editor if automatic migration fails

-- CreateTable: relay_logs
CREATE TABLE IF NOT EXISTS "relay_logs" (
    "id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "chain_id" TEXT NOT NULL,
    "servicer_address" TEXT NOT NULL,
    "request_type" TEXT NOT NULL DEFAULT 'http',
    "method" TEXT NOT NULL,
    "response_time_ms" INTEGER NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "session_height" BIGINT,
    "bytes_transferred" INTEGER NOT NULL DEFAULT 0,
    "geo_zone" TEXT,
    "error_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relay_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: websocket_sessions
CREATE TABLE IF NOT EXISTS "websocket_sessions" (
    "id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "connection_id" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "servicer_address" TEXT NOT NULL,
    "connected_at" TIMESTAMP(3) NOT NULL,
    "disconnected_at" TIMESTAMP(3),
    "state" TEXT NOT NULL DEFAULT 'active',
    "subscription_type" TEXT,
    "subscription_params" TEXT,
    "subscribed_at" TIMESTAMP(3),
    "messages_sent" INTEGER NOT NULL DEFAULT 0,
    "messages_received" INTEGER NOT NULL DEFAULT 0,
    "session_duration_seconds" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "websocket_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: api_logs
CREATE TABLE IF NOT EXISTS "api_logs" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: relay_logs -> apps
ALTER TABLE "relay_logs"
ADD CONSTRAINT "relay_logs_app_id_fkey"
FOREIGN KEY ("app_id") REFERENCES "apps"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: websocket_sessions -> apps
ALTER TABLE "websocket_sessions"
ADD CONSTRAINT "websocket_sessions_app_id_fkey"
FOREIGN KEY ("app_id") REFERENCES "apps"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "relay_logs_app_id_idx" ON "relay_logs"("app_id");
CREATE INDEX IF NOT EXISTS "relay_logs_created_at_idx" ON "relay_logs"("created_at");
CREATE INDEX IF NOT EXISTS "relay_logs_chain_id_idx" ON "relay_logs"("chain_id");
CREATE INDEX IF NOT EXISTS "websocket_sessions_app_id_idx" ON "websocket_sessions"("app_id");
