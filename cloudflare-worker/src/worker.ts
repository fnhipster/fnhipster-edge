/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Env } from './env';
import { decorate } from './decorate';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// parse url
		const url = new URL(request.url);

		// is it a draft?
		const drafts = url.pathname.startsWith('/drafts/');

		// is it a request from development environment?
		const development = /localhost|127\.0\.0\.1/.test(url.hostname);

		// is it preview environment? i.e.: domain.page
		const preview = development || url.hostname.endsWith('.page');

		// only allow drafts in preview environment
		if (drafts && !preview) {
			return new Response('Not Found', { status: 404 });
		}

		let strippedQS;

		if (url.search && !url.pathname.match(/\.[0-9a-z]+$/i)) {
			// extensionless request w/ query string: strip query string
			strippedQS = url.search;
			url.search = '';
		}

		if (!env.PRODUCTION_BRANCH_PROJECT) {
			throw new Error('PRODUCTION_BRANCH_PROJECT is not set');
		}

		url.hostname = env.PRODUCTION_BRANCH_PROJECT ? '.hlx.page' : 'hlx.live';

		if (development) {
			url.port = '3000';
			url.hostname = 'localhost';
		}

		const req = new Request(url, request);

		const host = req.headers.get('host') ?? '';

		req.headers.set('x-forwarded-host', host ?? '');

		req.headers.set('x-byo-cdn-type', 'cloudflare');

		// set the following header if push invalidation is configured
		// (see https://www.hlx.live/docs/setup-byo-cdn-push-invalidation#cloudflare)
		req.headers.set('x-push-invalidation', 'enabled');

		let res = await fetch(req, {
			cf: {
				// cf doesn't cache html by default: need to override the default behavior
				cacheEverything: !development,
			},
		});

		res = new Response(res.body, res);

		if (res.status === 301 && strippedQS) {
			const location = res.headers.get('location');

			if (location && !location.match(/\?.*$/)) {
				res.headers.set('location', `${location}${strippedQS}`);
			}
		}

		res.headers.delete('age');
		res.headers.delete('x-robots-tag');

		return decorate(res, { url, development });
	},
};
