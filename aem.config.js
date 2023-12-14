export default {
  scripts: [
    {
      route: /.*/,
      path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui/components/index.min.js',
      eager: true,
    },
  ],
  styles: [
    {
      route: /.*/,
      path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui/styles/fn.min.css',
      eager: true,
    },
    {
      route: /.*/,
      path: 'https://use.typekit.net/joe8rol.css',
    },
  ],
};
