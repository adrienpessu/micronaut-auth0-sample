const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'auth0',
  chromeWebSecurity: false,
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      // configure plugins here
    }
  }
})
