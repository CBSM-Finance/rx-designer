const path = require("path");

module.exports = {
  target: "electron-main",
  entry: "./electron/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./dist-electron"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  node: { __dirname: false, __filename: false },
};
