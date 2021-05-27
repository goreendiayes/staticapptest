const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  //our index file
  devtool: "inline-source-map",
  entry: { entry: ['@babel/polyfill', path.resolve(__dirname, "src/index.jsx")]},
  target: "web",
  externals: ["fs", "crypto", "path", "buffer"],

  //Where we put the production code
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    publicPath: "/",
  },
  // This says to webpack that we are in development mode and write the code in webpack file in different way
  mode: "development",
  module: {
    rules: [
      //Allows use javascript
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, //don't test node_modules folder
        use: {
          loader: "babel-loader",
        },
        resolve: {
          extensions: [".js", ".jsx"],
        },
      },
      //Allows use of CSS
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      //Allows use of images
      {
        test: /\.(svg)$/i,
        use: ["@svgr/webpack", "file-loader"],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  plugins: [
    //Allows remove/clean the build folder
    new CleanWebpackPlugin(),
    //Allows update react components in real time
    new HotModuleReplacementPlugin(),
    //Allows to create an index.html in our build folder
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"), //we put the file that we created in public folder
    }),
    //This get all our css and put in a unique file
    new MiniCssExtractPlugin({
      filename: "styles.[contentHash].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "public/data/*.*",
          to({ context, absoluteFilename }) {
            return "data/[name][ext]";
          },
        },
        //{
        //  from: "public/scripts/*.*",
        //  to({ context, absoluteFilename }) {
        //    return "scripts/[name][ext]";
        //  },
        //},
      ],
    }),
  ],
  //Config for webpack-dev-server module
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    port: 8000,
  },
};