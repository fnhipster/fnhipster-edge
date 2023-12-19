interface DecoratorOptions {
	url: URL;
	development?: boolean;
}

export function decorate(res: Response, options: DecoratorOptions) {
	res = new HTMLRewriter()
		// Inline Scripts
		.on('script[data-edge-inline]', new InlineESM(options.url, options.development))

		// Transform
		.transform(res);

	return res;
}
class InlineESM {
	constructor(private url: URL, private development = false) {}

	async element(element: Element) {
		const src = element.getAttribute('src');

		if (!src) return;

		const url = new URL(src, this.url);

		try {
			const res = await fetch(url, { cf: { cacheEverything: !this.development } });
			if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
			const inline = await res.text();
			element.setInnerContent(`\n${inline}\n`, { html: true });
		} catch (error) {
			console.error(error);
		}
	}
}
