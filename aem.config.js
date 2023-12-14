export default {
  scripts: [
    // {
    //   route: /.*/,
    //   path: '/vendors/fn-ui/components/index.js',
    //   // path: 'http://localhost:6006/components/index.js',
    //   eager: true,
    // },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-binary/fn-binary.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-content/fn-content.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-footer/fn-footer.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-header/fn-header.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-image/fn-image.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-link/fn-link.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-logo/fn-logo.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-columns/fn-columns.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-hero/fn-hero.js', eager: true },
    { route: /.*/, path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/components/fn-app/fn-app.js', eager: true },
  ],
  styles: [
    {
      route: /.*/,
      path: 'https://unpkg.com/@fnhipster/fn-ui@0.1.1/styles/fn.css',
      // path: 'http://localhost:6006/styles/fn.css',
      eager: true,
    },
    // {
    //   route: /.*/,
    //   path: 'https://use.typekit.net/joe8rol.css',
    // },
  ],
};
