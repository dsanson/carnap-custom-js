const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index-dev.js',
  devtool: 'source-map',
  output: {
    filename: 'logic-book-dev.js',
    path: path.resolve(__dirname, 'dist'),
    // library: {
    //   name: 'logicBook',
    //   type: 'umd'
    // },
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    ]
  },
  externals: {
    jquery: 'jquery',
  },
};
