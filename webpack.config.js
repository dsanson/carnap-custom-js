const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'logic-book.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'LogicBook',
      type: 'umd'
    },
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
