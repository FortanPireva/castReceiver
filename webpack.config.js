const path = require("path");
const Dotenv = require("dotenv-webpack");
module.exports = (env) => ({
  devtool: "inline-source-map",
  entry: "./src/js/vpReceiver.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "vpReceiver.js",
  },
  plugins: [
    new Dotenv({
      path: `./${env.environment}.env`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader", // post process the compiled CSS
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
      },
    ],
  },
});
