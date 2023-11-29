interface DecoratorOptions {
	url: URL;
	development?: boolean;
}

export function decorate(res: Response, options: DecoratorOptions) {
	/** Fragments */
	res = new HTMLRewriter()
		// Embeded
		.on('.fragment', new Fragment(options.url, undefined, !options.development))

		// Footer
		.on('footer', new Fragment(options.url, '/fragments/footer'))

		// Transform
		.transform(res);

	/** Blocks */
	res = new HTMLRewriter()
		.on('header', new CustomElement('header'))

		.on('footer', new CustomElement('footer'))
		.on('footer > div', new PruneElement())

		// Fragments
		.on('.fragment, .fragment > div, .fragment > div > div', new PruneElement())

		// Items Blocks
		.on('div[class]:not(.fragment)', new CustomElement())
		.on('div[class]:not(.fragment) > div', new Slots())

		// TODO: need convetion for non "metadata" blocks that are key-values slots
		// Metadata Blocks
		.on('div[class$="-metadata"]', new Metadata())
		.on('div[class$="-metadata"] > div', new KeyValueSlots())
		.on('div[class$="-metadata"] div', new PruneElement())

		// Transform
		.transform(res);

	return res;
}

class Fragment {
	private baseURL: URL;
	private path?: string;
	private cache: boolean;

	constructor(baseURL: URL, path?: string, cache = true) {
		if (!baseURL) throw new Error('URL is required');

		this.baseURL = baseURL;
		this.path = path;
		this.cache = cache;
	}

	async element(element: Element) {
		if (this.path) {
			const content = await this.fetchFragment(this.path);

			if (content) {
				element.append(content, { html: true });
			}
		}
	}

	async text(text: Text) {
		const empty = !text.text.trim().toLowerCase();

		if (empty) return;

		const content = await this.fetchFragment(text.text);

		if (content) {
			text.replace(content, { html: true });
		}
	}

	async fetchFragment(path: string) {
		const fragmentURL = new URL(`${path}.plain.html`, this.baseURL);

		const response = await fetch(fragmentURL, {
			cf: { cacheEverything: this.cache },
		});

		if (response.ok) return await response.text();

		console.error(`Fragment ${fragmentURL} not found.`);
	}
}

class CustomElement {
	constructor(private tagName?: string) {}

	element(element: Element) {
		const tagName = element.getAttribute('class')?.split(' ')[0]?.toString() || this.tagName;

		if (tagName && tagName !== 'aem-block') {
			element.setAttribute('class', 'aem-block');
			element.tagName = `aem-${tagName}`;
		}
	}
}

class Metadata {
	element(element: Element) {
		const tagName = element.getAttribute('class')?.split(' ')[0]?.toString();

		if (tagName) {
			element.setAttribute('class', 'aem-block aem-metadata');

			if (tagName !== 'aem-block') {
				element.tagName = `aem-${tagName}`;
			}
		}
	}
}

class KeyValueSlots {
	private values = new Set<string>();

	element(element: Element) {
		element.removeAndKeepContent();
		this.values.clear();
	}

	text(text: Text) {
		const empty = !text.text.trim().toLowerCase();

		// stop if it's an empty string
		if (empty) return;

		// No key yet? This is a key
		if (this.values.size === 0) {
			text.remove();
		}

		this.values.add(text.text);

		// No previous key? This is a key
		if (this.values.size > 1) {
			const key = this.values.values().next().value.toLowerCase();
			text.replace(`<div slot="${key}">${text.text}</div>`, { html: true });
		}
	}
}

class Slots {
	element(element: Element) {
		element.setAttribute('slot', 'item');
	}
}

class PruneElement {
	element(element: Element) {
		element.removeAndKeepContent();
	}

	text(text: Text) {
		const empty = !text.text.trim().toLowerCase();

		if (empty) {
			text.remove();
		}
	}
}
