# Sample Vue.js and Babylon.js app

This is a simple starter for experimenting with using the Vue.js, Vuetify, and
Babylon.js libraries.

## Installation and usage

[Node.js](https://nodejs.org/en/) is the only requirement for local development.
Once node.js is installed, then from the root folder run:

```cmd
npm install
npm run build
```

This will install the required dependencies locally into the `./node_modules` directory,
then kick off a WebPack build of the TypeScript and Vue files that watches for
changes and rebuilds automatically. (The generated files go into the `./dist` directory).

To launch a local web server, in another window run `npm run start`. This will
run a web server locally using the [http-server](https://www.npmjs.com/package/http-server)
package, and display which URL the site can be accessed on (e.g. probably something
like `http://127.0.0.1:8080`).

## Development

Besides the `index.html` and `style.css` files in the root directory, the only code
for the site is contained in the `./Scripts` directory. This consistent of TypeScript
source files, and Vue.js [Single File Components](https://vuejs.org/v2/guide/single-file-components.html).

To learn more about the tools and libraries used, see the links below:

- TypeScript <https://www.typescriptlang.org/docs>
- Vue.js <https://vuejs.org/>
- Vue-router <https://router.vuejs.org/>
- Vuetify <https://vuetifyjs.com/en/>
- Babylon.js <https://doc.babylonjs.com/>
- Node.js <https://nodejs.org/en/docs/> and NPM <https://docs.npmjs.com/>
- WebPack <https://webpack.js.org/concepts/>
