export default {
  scripts: [
    {
      route: /.*/,
      path: '/vendors/@fnhipster/fn-ui/components/index.js',
      eager: true,
    },
  ],
  styles: [
    {
      route: /.*/,
      path: '/vendors/@fnhipster/fn-ui/styles/fn.css',
      eager: true,
    },
    {
      route: /.*/,
      path: 'https://use.typekit.net/joe8rol.css',
    },
  ],
};
