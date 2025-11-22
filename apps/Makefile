include api/_api.mk
include web/_web.mk

.PHONY: dev install build help

help:
	@echo "Available commands:"
	@echo "  make dev      - Start both backend and frontend in parallel"
	@echo "  make install  - Install dependencies for both"
	@echo "  make build    - Build both projects"
	@echo "  make api-dev  - Start only backend"
	@echo "  make web-dev  - Start only frontend"

install: api-install web-install

dev:
	@echo "Starting Lexora..."
	$(MAKE) -j2 api-dev web-dev

build: api-build web-build
