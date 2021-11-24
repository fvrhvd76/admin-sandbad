import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "",
    title: "پنل ادمین - سند باد",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/images/logo.png" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["../assets/scss/style.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/axios"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxtjs/auth"],
  server: {
    port: 8000,
    host: "0.0.0.0"
  },

  
  axios: {
    // baseURL: "http://172.16.103.70:8000"
    // baseURL: "https://sandbad-back.re-vision.tech"
    // baseURL: "https://dev-api.sandbad.io"
    baseURL: "https://api.sandbad.io"
    // Used as fallback if no runtime config is provided
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    rtl: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#F48C3A",
          bgLight: "#f8f8f8"
          // accent: colors.grey.darken3,
          // secondary: colors.amber.darken3,
          // info: colors.primary.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3
        },
        dark: {
          primary: "#f37021"
          // accent: colors.grey.darken3,
          // secondary: colors.amber.darken3,
          // info: colors.primary.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3
        }
      }
    }
  },

  router: {
    middleware: ["auth"],
    extendRoutes(routes, resolve) {
      routes.push({
        name: "custom",
        path: "*",
        component: resolve(__dirname, "pages/error/index.vue")
      });
    }
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "admins/login/",
            method: "post",
            propertyName: "access"
          },
          logout: { url: "user/logout/", method: "post" },
          user: false
        },
        tokenRequired: true,
        tokenType: "Bearer",
        globalToken: true,
        autoFetchUser: true
      }
    },
    redirect: {
      login: "/login",
      logout: "/login",
      callback: false,
      home: "/"
    },
    watchLoggedIn: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
