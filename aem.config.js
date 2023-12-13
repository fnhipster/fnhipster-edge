export default {
  scripts: [
    { route: /.*/, path: 'http://localhost:6006/components/index.js', eager: true },
  ],
  styles: [
    { route: /.*/, path: 'http://localhost:6006/styles/fn.css', eager: true },
    { route: /.*/, path: 'https://use.typekit.net/joe8rol.css' },
  ],
};
