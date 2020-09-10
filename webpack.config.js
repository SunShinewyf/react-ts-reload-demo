const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsImportPluginFactory = require("ts-import-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  entry: { index: ["./src/index.tsx"] },
  mode: isDevelopment ? "development" : "production",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts", ".less", ".json"],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          { loader: "cache-loader" },
          {
            loader: "thread-loader",
            options: {
              workers: require("os").cpus().length - 1,
            },
          },
          {
            loader: require.resolve("babel-loader"),
            options: {
              plugins: [
                isDevelopment && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  TsImportPluginFactory({
                    libraryName: "antd",
                    libraryDirectory: "es",
                    style: true,
                  }),
                ],
              }),
              compilerOptions: {
                module: "es2015",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          { loader: "css-loader" },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "index.html"),
      // inject: false,
      mode: isDevelopment ? "development" : "production",
      chunks: ["index"],
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  // externals: {
  //   react: "var window.React",
  //   "react-dom": "var window.ReactDOM",
  // },
  devServer: {
    stats: {
      chunks: false,
      colors: true,
      modules: false,
    },
    host: "0.0.0.0",
    port: 8888,
  },
};
