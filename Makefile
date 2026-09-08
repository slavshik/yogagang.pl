.DEFAULT_GOAL := dev
include make/vite.mk

.PHONY: build check

build:
	npm run build

check:
	npm run typecheck && npm run format:check
