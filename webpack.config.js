"use strict";

const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  mode: "development",
  entry: "./Scripts/app.ts",
  output: {
    path: path.join(__dirname, "dist/"),
    filename: `bundle.js`
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".vue", ".css"],
    modules: [ "node_modules" ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "css-loader", options: { sourceMap: true } }
        ]
      }
    ]
  },
  externals: {
    "oimo": true,
    "cannon": true,
    "vue": "Vue",
    "babylonjs": "BABYLON",
    "babylonjs-loaders": "BABYLON",
    "babylonjs-materials": "BABYLON"
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
};
