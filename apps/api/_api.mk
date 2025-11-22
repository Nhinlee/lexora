.PHONY: api-dev api-build api-install

api-install:
	cd api && pnpm install

api-dev:
	cd api && pnpm start:dev

api-build:
	cd api && pnpm build

api-db-up:
	cd api && docker-compose up -d

api-db-down:
	cd api && docker-compose down

api-db-migrate:
	cd api && pnpm prisma migrate dev --name init_postgres

api-db-reset:
	cd api && pnpm prisma migrate reset
