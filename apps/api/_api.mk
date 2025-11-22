.PHONY: api-dev api-build api-install

api-install:
	cd api && pnpm install

api-dev:
	cd api && pnpm start:dev

api-build:
	cd api && pnpm build
