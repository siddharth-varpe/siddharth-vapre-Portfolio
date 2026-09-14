-- ==============================================================================
-- 0002_auth_tables.sql
-- Better Auth Relational PostgreSQL Schema for Supabase
-- ==============================================================================

-- 1. Users (Admin identity accounts)
CREATE TABLE IF NOT EXISTS public."user" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "username" TEXT UNIQUE
);

-- 2. Sessions (Active administrative session tokens)
CREATE TABLE IF NOT EXISTS public."session" (
    "id" TEXT PRIMARY KEY,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE
);

-- 3. Accounts (Authentication credentials and hashed passwords)
CREATE TABLE IF NOT EXISTS public."account" (
    "id" TEXT PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMPTZ,
    "refreshTokenExpiresAt" TIMESTAMPTZ,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Verifications (Password reset & verification tokens)
CREATE TABLE IF NOT EXISTS public."verification" (
    "id" TEXT PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast session and credential lookups
CREATE INDEX IF NOT EXISTS idx_session_token ON public."session" ("token");
CREATE INDEX IF NOT EXISTS idx_session_userId ON public."session" ("userId");
CREATE INDEX IF NOT EXISTS idx_account_userId ON public."account" ("userId");
CREATE INDEX IF NOT EXISTS idx_user_email ON public."user" ("email");
CREATE INDEX IF NOT EXISTS idx_user_username ON public."user" ("username");
