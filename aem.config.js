export default {
  scripts: [
    {
      route: /.*/,
      path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui/components/index.min.js',
      // path: 'http://localhost:6006/components/index.js',
      eager: true,
    },
  ],
  styles: [
    {
      route: /.*/,
      path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui/styles/fn.min.css',
      // path: 'http://localhost:6006/styles/fn.css',
      eager: true,
    },
    {
      route: /.*/,
      path: 'https://use.typekit.net/joe8rol.css',
    },
  ],
};
