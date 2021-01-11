// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/#configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {
      url: '/',
      static: true
    },
    src: {
      url: '/dist'
    }
  }
  // plugins: [],
  // installOptions: {},
  // devOptions: {},
  // buildOptions: {},
}
