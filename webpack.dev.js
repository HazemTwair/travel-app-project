const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    entry: "./src/client/index.js",
    mode: "development",
    devtool: "source-map",
    stats: "verbose",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false,
        }),
        new WorkboxPlugin.GenerateSW(),
    ],
    devServer: {
        port: 3000,
        allowedHosts: "all",
    },
};
