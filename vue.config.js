// vue.config.js
module.exports = {
  filenameHashing: false,
  productionSourceMap: process.env.NODE_ENV !== "production",
  devServer: {
    port: 8081,
    proxy: {
      "/api": {
        // target: 'http://localhost:9998',
        target: "http://1.15.57.174:9898",
        // target: 'http://47.98.202.148:8080',
        // secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { "^/api": "" }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
      },
    },
  },
  // configureWebpack: (config) => {
  //   // console.log(config)
  //   if (process.env.NODE_ENV !== "production") {
  //     // 为开发环境修改配置...
  //     // config.devServer = {
  //     //   port: 8081,
  //     //   host: "0.0.0.0",
  //     //   overlay: {
  //     //     errors: true,
  //     //   },
  //     //   hot: true,
  //     //   historyApiFallback: true,
  //     //   // historyApiFallback: {
  //     //   //   index: "/index.html", // 如果output中配置了publicPath,那么这边前面也要加上publicPath
  //     //   // },
  //     //   proxy: {
  //     //     "/api": {
  //     //       // target: 'http://localhost:9998',
  //     //       target: "http://127.0.0.1:9898",
  //     //       // target: 'http://47.98.202.148:8080',
  //     //       // secure: false, // 如果是https接口，需要配置这个参数
  //     //       changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
  //     //       pathRewrite: { "^/api": "" }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
  //     //     },
  //     //   },
  //     //   // open: true,
  //     // };
  //     // console.log(config)
  //   } else if (process.env.NODE_ENV === "production") {
  //     // console.log(config.output)
  //     // config.output = {
  //     //   ...config.output,
  //     //   filename: 'js/[name].js',
  //     //   chunkFilename: 'js/[name].js'
  //     // }
  //   }
  // },
};
