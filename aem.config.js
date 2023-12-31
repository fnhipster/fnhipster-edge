window.AEM_CONFIG = {
  // Bricks
  bricks: [
    {
      route: /.*/,
      name: 'aem-root',
      template: true,
    },
    {
      route: /.*/,
      name: 'aem-hero',
      selector: '.hero',
      template: true,
    },
    {
      route: /.*/,
      name: 'aem-columns',
      selector: '.columns',
      template: true,
    },
    {
      route: /.*/,
      name: 'aem-page-metadata',
      selector: '.page-metadata',
      template: false,
    },
    {
      route: /.*/,
      name: 'aem-section-metadata',
      selector: '.page-metadata',
      template: false,
    },
  ],
  // ESM Modules
  modules: [
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-app/fn-app.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-binary/fn-binary.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-content/fn-content.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-footer/fn-footer.js',
      lazy: true,
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-header/fn-header.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-image/fn-image.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-link/fn-link.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-logo/fn-logo.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-columns/fn-columns.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-hero/fn-hero.js',
    },
  ],

  // Scripts
  // scripts: [],

  // Styles
  styles: [
    {
      route: /.*/,
      path: '/vendors/fn-ui/styles/fn.css',
    },
    // {
    //   route: /.*/,
    //   path: '/vendors/fn-ui/styles/fonts.css',
    //   lazy: true,
    // },
  ],

  // Load Fonts
  // fonts: [
  //   {
  //     route: /.*/,
  //     name: 'Handjet',
  //   },
  //   {
  //     route: /.*/,
  //     name: 'Noto Sans Mono',
  //   },
  //   {
  //     route: /.*/,
  //     name: 'Press Start 2P',
  //   },
  // ],
};
