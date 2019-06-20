const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|svg|svgz|jpg|gif|jpeg|ico)(\?.+)?$$/,
        exclude: [resolve('src/icons')],
        use: [
          {
            loader: 'url-loader', // 根据图片大小，把图片优化成base64
            options: {
              limit: 10000
            }
          },
          {
            loader: 'image-webpack-loader',//image-webpack-loader可以帮助我们对图片进行压缩和优化。
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          },
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            }
          }
        ]
      },
      {
        // 'transform-runtime' 插件告诉 babel 要引用 runtime 来代替注入。
        test: /\.js$/,
        exclude: /(node_modules)/,
        // 加快编译速度，不包含node_modules文件夹内容,但是有时候要依赖这些包，js压缩不能压缩es代码，
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true//当有设置时，指定的目录将用来缓存 loader 的执行结果
          }
        }, {
          loader: 'eslint-loader',
          options: {
            // eslint options (if necessary)
            fix: true//自动修复
          }
        }]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },

    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],  // 默认值: [".js",".json"] 自动解析确定的扩展。
    alias: {
      '@': resolve('src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '起点', // 默认值：Webpack App
      filename: 'index.html', // 默认值： 'index.html',打包到dist的名称
      template: resolve('public/index.html'),//模板名称
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true // 移除属性的引号
      },
      favicon: resolve('public/favicon.ico')
    }),
    new CleanWebpackPlugin(),//清理 dist 目录
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ],
}
