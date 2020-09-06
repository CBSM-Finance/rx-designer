const path = require("path");
const ElectronReloadPlugin = require('webpack-electron-reload')({
  path: path.join(__dirname, './main.js'),
});

module.exports = {
  target: "electron-main",
  entry: "./electron/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./"),
  },
  plugins: [
    ElectronReloadPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "electron/tsconfig.json",
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
