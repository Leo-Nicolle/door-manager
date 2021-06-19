export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'labaux',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/passkey.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '@creativebulma/bulma-divider/dist/bulma-divider.min.css', lang: 'css' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    {src: '~/plugins/vue-json-editor.js', ssr: false},
    '~/mixins/encrypt',
    '~/mixins/validation',
    '~/mixins/string-dist',
    '~/mixins/search',
    '~/mixins/json-schema'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: 'http://localhost:5052', // Used as fallback if no runtime config is provided
  },

  // server: {
  //   entities: [
  //     'doors',
  //     'users',
  //     'schedules',
  //     'groups',
  //     'logs',
  //     // 'code',

  //   ],
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}