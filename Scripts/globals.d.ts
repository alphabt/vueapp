// Treat any .vue module imported as just being a Vue component
declare module "*.vue" {
    export default Vue;
}

// Vuetify doesn't export as a UMD type, so declare it here.
declare var Vuetify: import("vuetify").Vuetify;

// Pull in the VueRouter definition explicitly from the package
// This also augments the Vue instances with $route and $router
declare var VueRouter: import("vue-router").default;
