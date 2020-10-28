'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    // 打包完成后，修改index.html中的文件請求路徑，以防止客戶端訪問出現緩存問題
    var dataOfIndexHtml = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
    var reg = /\.js\?sid=[a-zA-Z0-9]+"><\/script>/ig
    if (reg.test(dataOfIndexHtml)) {
      dataOfIndexHtml = dataOfIndexHtml.replace(reg, '.js?sid=' + new Date().getTime() + '"></script>')
    } else {
      dataOfIndexHtml = dataOfIndexHtml.replace(reg, '.js?sid=' + new Date().getTime() + '></script>')
    }

    fs.writeFile(path.join(__dirname, '../dist/index.html'), dataOfIndexHtml.trim(), function(err){
      if(err) {
        console.log('静态文件引用已更新失败')
      } else {
        console.log('静态文件引用已更新成功')
      }
    })
  })
})
