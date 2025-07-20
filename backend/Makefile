# Makefile cho backend (chạy local trên server)

.PHONY: build
build:
	pnpm install
	pnpm run build

.PHONY: runapp
runapp:
	docker compose up -d --build

.PHONY: stopapp
stopapp:
	docker compose down 