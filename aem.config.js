export default {
  scripts: [
    // {
    //   route: /.*/,
    //   path: '/vendors/fn-ui/components/index.js',
    //   // path: 'http://localhost:6006/components/index.js',
    //   eager: true,
    // },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-binary/fn-binary.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-content/fn-content.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-footer/fn-footer.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-header/fn-header.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-image/fn-image.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-link/fn-link.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-logo/fn-logo.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-columns/fn-columns.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-hero/fn-hero.js', eager: true },
    { route: /.*/, path: '/vendors/fn-ui/components/fn-app/fn-app.js', eager: true },
  ],
  styles: [
    {
      route: /.*/,
      path: '/vendors/fn-ui/styles/fn.css',
      // path: 'http://localhost:6006/styles/fn.css',
      eager: true,
    },
    {
      route: /.*/,
      path: 'https://use.typekit.net/joe8rol.css',
    },
  ],
};
