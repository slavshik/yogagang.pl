import { defineConfig, type Plugin } from 'vite';

/*
 * Umami, injected at build time rather than written into index.html.
 *
 * The tag appears only when UMAMI_WEBSITE_ID is set, so a build without it —
 * every local `make dev`, and any fork — ships no third-party request at all
 * rather than a script tag pointing at an empty id. The id itself is not a
 * secret: it is visible in the served HTML by definition, which is why the
 * workflow passes it as a repository *variable* and not a secret.
 *
 * data-domains is the reason localhost never shows up in the dashboard: the
 * tracker matches it against window.location.hostname and stays silent
 * anywhere else, so even a local build with the variable exported is inert.
 *
 * `defer` keeps it out of the critical path — it is fetched in parallel and
 * runs after the document is parsed, so it cannot delay first paint.
 */
function umami(): Plugin {
	const id = process.env.UMAMI_WEBSITE_ID?.trim();

	return {
		name: 'umami',
		apply: 'build',
		transformIndexHtml: {
			order: 'post',
			handler: (html) => {
				if (!id) return html;

				return {
					html,
					tags: [
						{
							tag: 'script',
							injectTo: 'head',
							attrs: {
								defer: true,
								src: 'https://cloud.umami.is/script.js',
								'data-website-id': id,
								'data-domains': 'yogagang.pl,www.yogagang.pl',
							},
						},
					],
				};
			},
		},
	};
}

export default defineConfig({
	// Served from the apex of its own domain, so absolute paths are correct and
	// keep the OG image URL in index.html honest.
	base: '/',
	plugins: [umami()],
	build: {
		// The page ships one small module and no framework. Inlining it saves the
		// round trip; the limit is well above what this site will ever produce.
		assetsInlineLimit: 4096,
		target: ['es2022', 'safari16'],
		modulePreload: { polyfill: false },
	},
	server: {
		// `make tailscale` binds a 100.x address and reaches the page from a phone.
		// Vite would otherwise reject the tailnet hostname as an unknown Host.
		allowedHosts: true,
	},
});
