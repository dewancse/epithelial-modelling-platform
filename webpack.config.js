module.exports = {
    entry: "./public/js/index.js",
    // entry: "./public/js/recommender.js",
    output: {
        path: __dirname,
        filename: "./public/bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader"}
        ]
    }
};