#!/usr/bin/env bash

# ==============================================================================
# Needlon Seller -> Monorepo Automated Migration Script
# ==============================================================================
# Safe-run checklist:
# 1. Commit or stash all working changes: git add . && git commit -m "pre-monorepo"
# 2. Run this script directly from the root of your `needlon_seller` folder.
# ==============================================================================

set -e

echo "🚀 Starting Needlon Seller monorepo migration..."

# Step 0: Clean cache and build artifacts to prevent file lock/copy issues
echo "🧹 Cleaning temporary files..."
rm -rf .next node_modules package-lock.json

# Step 1: Create target directory tree
echo "📁 Creating monorepo directories..."
mkdir -p apps/seller
mkdir -p packages/ui/components/ui packages/ui/lib
mkdir -p packages/db/db/schema packages/db/drizzle packages/db/scripts
mkdir -p packages/modules/modules packages/modules/tests

# Step 2: Migrate Database Package (packages/db)
echo "📦 Migrating Database package..."
[ -d "db" ] && mv db/* packages/db/db/ && rm -rf db
[ -d "drizzle" ] && mv drizzle/* packages/db/drizzle/ && rm -rf drizzle
[ -d "scripts" ] && mv scripts/* packages/db/scripts/ && rm -rf scripts
[ -f "drizzle.config.ts" ] && mv drizzle.config.ts packages/db/
[ -f "scratch-recreate-tables.ts" ] && mv scratch-recreate-tables.ts packages/db/

# Step 3: Migrate UI Package (packages/ui)
echo "📦 Migrating UI package..."
[ -d "components/ui" ] && mv components/ui/* packages/ui/components/ui/ && rm -rf components
[ -f "components.json" ] && mv components.json packages/ui/
# Copy utils.ts so both UI and App have access without immediate breaks
if [ -f "lib/utils.ts" ]; then
  cp lib/utils.ts packages/ui/lib/utils.ts
fi

# Step 4: Migrate Feature Modules & Tests (packages/modules)
echo "📦 Migrating Modules and Tests..."
[ -d "modules" ] && mv modules/* packages/modules/modules/ && rm -rf modules
[ -d "tests" ] && mv tests/* packages/modules/tests/ && rm -rf tests

# Step 5: Migrate Next.js Application (apps/seller)
echo "📦 Migrating Next.js Seller App..."
for item in app public hooks lib provider types next.config.ts postcss.config.mjs proxy.ts Dockerfile; do
  if [ -e "$item" ]; then
    mv "$item" apps/seller/
  fi
done

# Step 6: Create Package-level package.json files

echo "⚙️ Creating packages/db/package.json..."
cat << 'EOF' > packages/db/package.json
{
  "name": "@needlon/db",
  "version": "0.0.1",
  "private": true,
  "main": "./db/index.ts",
  "types": "./db/index.ts",
  "scripts": {
    "generate": "drizzle-kit generate",
    "migrate": "tsx db/migrate.ts",
    "seed": "tsx scripts/seed-database.ts",
    "check-types": "tsc --noEmit"
  }
}
EOF

echo "⚙️ Creating packages/ui/package.json..."
cat << 'EOF' > packages/ui/package.json
{
  "name": "@needlon/ui",
  "version": "0.0.1",
  "private": true,
  "exports": {
    "./components/*": "./components/ui/*.tsx",
    "./utils": "./lib/utils.ts"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
EOF

echo "⚙️ Creating packages/modules/package.json..."
cat << 'EOF' > packages/modules/package.json
{
  "name": "@needlon/modules",
  "version": "0.0.1",
  "private": true,
  "main": "./modules/index.ts",
  "types": "./modules/index.ts",
  "scripts": {
    "test": "jest",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@needlon/db": "workspace:*",
    "@needlon/ui": "workspace:*"
  }
}
EOF

# Move app package.json into apps/seller
[ -f "package.json" ] && mv package.json apps/seller/package.json

# Step 7: Create Root Monorepo Configuration Files

echo "⚙️ Creating root package.json..."
cat << 'EOF' > package.json
{
  "name": "needlon-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "check-types": "turbo check-types",
    "test": "turbo test",
    "db:generate": "pnpm --filter @needlon/db generate",
    "db:migrate": "pnpm --filter @needlon/db migrate",
    "db:seed": "pnpm --filter @needlon/db seed"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
EOF

echo "⚙️ Creating pnpm-workspace.yaml..."
cat << 'EOF' > pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
EOF

echo "⚙️ Creating turbo.json..."
cat << 'EOF' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

echo ""
echo "✅ Migration completed successfully!"
echo "👉 Next steps:"
echo "   1. Run 'pnpm install' from the project root."
echo "   2. In 'apps/seller/package.json', ensure '@needlon/db', '@needlon/ui', and '@needlon/modules' are in 'dependencies'."
echo "   3. Update 'apps/seller/next.config.ts' with transpilePackages."