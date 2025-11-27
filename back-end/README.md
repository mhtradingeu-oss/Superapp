# MH-OS Superapp Backend

## Local development
- Install deps: `npm ci`
- Build: `npm run build`

## Database migrations
- Local: `npm run prisma migrate dev`
- Docker: `docker compose exec backend npx prisma migrate deploy`

## RBAC seeding
- Local (TypeScript): `npm run seed:rbac:local`
- After build (compiled JS): `npm run seed:rbac:dist`
- Inside running container: `docker compose exec backend node dist/modules/security-governance/rbac.seed.js`

## Brand seeding (dev-only)
- Seed HAIROTICMEN brand, categories, sample products, and AI configs: `npm run seed:brand:hairoticmen`
- Run after the database is up and migrations are applied.
