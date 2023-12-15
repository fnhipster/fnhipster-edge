interface DecoratorOptions {
	url: URL;
	development?: boolean;
}

export function decorate(res: Response, options: DecoratorOptions) {
	res = new HTMLRewriter()
		// Transform
		.transform(res);

	return res;
}
