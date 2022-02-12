const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: 'production',
    entry: "./src/js/index.js",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build")
    },
    devServer: {
        static: "./build",
        open: true
    },
    module: {
        rules: [
            {
            test: path.resolve(__dirname, './src/css/styles.css'),
            use: [
            'style-loader',
            'css-loader'
            ]
            }
        ],    
    },
    plugins: [
    new HtmlWebpackPlugin({
        title: "TechNews",
        template: path.resolve(__dirname, "./src/index.html"),
        favicon: "./src/img/favicon.png"
    })
    ],
}