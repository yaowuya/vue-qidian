const path = require("path")
const merge = require("webpack-merge")
const common = require("./webpack.common")
const webpack = require("webpack")
const WebpackDevServerOutput = require("webpack-dev-server-output");

let devConfig = {
  mode: "development",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./dist")
  },
  devtool: 'inline-source-map',//使用 inline-source-map 选项，这有助于解释说明 js 原始出错的位置。（不要用于生产环境）
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',//必须要有
              sourceMap: true,
              plugins: loader => [
                require('autoprefixer')({browsers: ['> 0.15% in CN']}) // 添加前缀
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),  // 更容易查看(patch)的依赖,和热更新有关
    new webpack.HotModuleReplacementPlugin(),  // 替换插件，和热更新有关
    new WebpackDevServerOutput({
      path: path.resolve(__dirname, "./dist"),
      isDel: true
    })
  ]
}
//热更新
devConfig.devServer = {
  clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
  hot: true,  // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
  contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
  compress: true, // 一切服务都启用gzip 压缩
  host: '127.0.0.1', // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
  port: 8080, // 端口
  open: true, // 是否打开浏览器
  overlay: {  // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
    warnings: true,
    errors: true
  },
  publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
  proxy: {  // 设置代理
    "/api": {  // 访问api开头的请求，会跳转到  下面的target配置
      target: "http://192.168.0.102:8080",// /api/getInfo=>http://192.168.0.102:8080/mockjsdata/5/api/info
      pathRewrite: {"^/api": "/mockjsdata/5/api"}//使用 "/mockjsdata/5/api"替代"api"
    }
  },
  quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
  watchOptions: { // 监视文件相关的控制选项
    poll: true,   // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
    ignored: /node_modules/, // 忽略监控的文件夹，正则
    aggregateTimeout: 300 // 默认值，当第一个文件更改，会在重新构建前增加延迟
  }
}

module.exports = merge(common, devConfig)
