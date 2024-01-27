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
      name: 'aem-menu',
      selector: '.menu',
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
      name: 'aem-section-metadata',
      selector: '.section-metadata',
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
      path: '/vendors/fn-ui/components/fn-content/fn-content.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-content/fn-content.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-section/fn-section.js',
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
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-footer/fn-footer.js',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/components/fn-binary/fn-binary.js',
    },
  ],

  // Styles
  styles: [
    {
      route: /.*/,
      path: '/vendors/fn-ui/styles/fn.css',
    },
    {
      route: /.*/,
      path: '/vendors/fn-ui/styles/fonts.css',
      lazy: true,
    },
  ],

  // Prefetch Data
  initialData: [
    {
      route: /.*/,
      path: '/query-index.json',
    },
  ],
};
