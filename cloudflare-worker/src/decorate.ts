interface DecoratorOptions {
	url: URL;
	development?: boolean;
}

export function decorate(res: Response, options: DecoratorOptions) {
	res = new HTMLRewriter()
		// Header
		.on('header', new CustomElement('header'))

		// Footer
		.on('footer', new CustomElement('footer'))

		// Blocks
		.on('div[class]', new CustomElement())
		.on('div[class] > div', new Slots())

		// Transform
		.transform(res);

	return res;
}

class CustomElement {
	constructor(private tagName?: string) {}

	element(element: Element) {
		const originalClass = element.getAttribute('class')?.toString() || '';
		const tagName = element.getAttribute('class')?.split(' ')[0]?.toString() || this.tagName;

		if (tagName && tagName !== 'aem-block') {
			element.setAttribute('class', `aem-block ${originalClass}`);
			element.tagName = `aem-${tagName}`;
		}
	}
}

class Slots {
	element(element: Element) {
		element.setAttribute('slot', 'item');
	}
}
