// Treat any .vue module imported as just being a Vue component
declare module "*.vue" {
    export default Vue;
}

// Vuetify doesn't export as a UMD type, so declare it here.
declare var Vuetify: import("vuetify").Vuetify;
