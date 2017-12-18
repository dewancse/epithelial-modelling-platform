module.exports = {
    entry: "./src/js/index.js",
    output: {
        path: __dirname,
        filename: "./src/bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader"}
        ]
    }
};