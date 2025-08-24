// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/FIT5032_A2_35523298_Yu-Zhong/'
    : '/',
  
  transpileDependencies: true,
  
  // PWA 配置支持离线功能
  pwa: {
    name: 'HealthyPathway',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    }
  },

  // 开发服务器配置
  devServer: {
    port: 8080,
    host: 'localhost',
    // 加速开发服务器
    hot: true,
    compress: true,
    open: false
  },

  // 构建优化
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    },
    // 性能优化
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          }
        }
      }
    }
  },

  // 并行构建
  parallel: require('os').cpus().length > 1,

  // 生产环境关闭 source map 加速构建
  productionSourceMap: false
})
  // 缓存配置
  cache: {
    type: 'filesystem'
  }

