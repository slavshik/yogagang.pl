# Copy this file into any Vite repo and include it from its Makefile.
# Set VITE_DIR before including when package.json is not at the repo root.
PORT ?= 5173
PREVIEW_PORT ?= 4173
TAILSCALE ?= tailscale
VITE_DIR ?= .
VITE ?= npx --no-install vite

.PHONY: dev lan tailscale preview

# Let Vite bind the next available port atomically. Its startup output is the
# source of truth for URLs: never advertise the requested port before binding.
# Explicit false also overrides strictPort: true in a project's Vite config.
dev:
	@cd "$(VITE_DIR)" && $(VITE) --host 0.0.0.0 --port "$(PORT)" --strictPort false

lan: dev

tailscale:
	@command -v "$(TAILSCALE)" >/dev/null 2>&1 || { echo "Tailscale CLI not found; set TAILSCALE=/path/to/cli" >&2; exit 1; }
	@set -eu; \
		tailnet_ip=$$("$(TAILSCALE)" ip -4); \
		printf '%s\n' "$$tailnet_ip" | awk 'END { exit !(NR == 1 && $$0 ~ /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$$/) }' || \
			{ echo "No Tailscale IPv4: connect this machine to Tailscale first." >&2; exit 1; }; \
		echo "Open the Network URL printed by Vite on a device connected to Tailscale; Ctrl-C to stop."; \
		cd "$(VITE_DIR)"; \
		exec $(VITE) --host "$$tailnet_ip" --port "$(PORT)" --strictPort false

preview:
	@cd "$(VITE_DIR)" && $(VITE) preview --host 0.0.0.0 --port "$(PREVIEW_PORT)" --strictPort false
