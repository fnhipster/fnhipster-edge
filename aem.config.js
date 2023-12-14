export default {
  scripts: [
    // {
    //   route: /.*/,
    //   path: '/vendors/fn-ui/components/index.js',
    //   // path: 'http://localhost:6006/components/index.js',
    //   eager: true,
    // },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-binary/fn-binary.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-content/fn-content.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-footer/fn-footer.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-header/fn-header.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-image/fn-image.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-link/fn-link.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-logo/fn-logo.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-columns/fn-columns.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-hero/fn-hero.min.js', eager: true },
    { route: /.*/, path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui@0/components/fn-app/fn-app.min.js', eager: true },
  ],
  styles: [
    {
      route: /.*/,
      path: 'https://cdn.jsdelivr.net/npm/@fnhipster/fn-ui/styles/fn.min.css',
      // path: 'http://localhost:6006/styles/fn.css',
      eager: true,
    },
    // {
    //   route: /.*/,
    //   path: 'https://use.typekit.net/joe8rol.css',
    // },
  ],
};
