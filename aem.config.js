export default {
  scripts: [
    {
      route: /.*/,
      path: '/vendors/node_modules/@fnhipster/fn-ui/components/index.js',
      eager: true,
    },
  ],
  styles: [
    {
      route: /.*/,
      path: '/vendors/node_modules/@fnhipster/fn-ui/styles/fn.css',
      eager: true,
    },
    {
      route: /.*/,
      path: 'https://use.typekit.net/joe8rol.css',
    },
  ],
};
