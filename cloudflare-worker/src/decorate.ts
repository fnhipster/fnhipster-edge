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
		const tagName = element.getAttribute('class')?.split(' ')[0]?.toString() || this.tagName;

		const originalClass = element.getAttribute('class')?.toString() || '';

		let className = 'aem-block';

		if (originalClass) {
			className += ' ' + originalClass;
		}

		if (tagName && tagName !== 'aem-block') {
			element.setAttribute('class', className);
			element.tagName = `aem-${tagName}`;
		}
	}
}

class Slots {
	element(element: Element) {
		element.setAttribute('slot', 'item');
	}
}
