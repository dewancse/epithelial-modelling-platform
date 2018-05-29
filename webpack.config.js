module.exports = {
    entry: "./src/js/index.js",
    // entry: "./src/js/recommender.js",
    // entry: "./src/js/usecase.js",
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