/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-04-14 11:21:23
 * @LastEditTime: 2022-05-22 12:40:40
 * @LastEditors: lanchao
 * @Reference:
 */
module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  //electron 13 把"build":{}从package.json移除，在vue.config.js里写
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.ts',
      nodeIntegration: true,
      builderOptions: {
        productName: 'zhzy-tveep-codeEditor', //打包名称
        appId: 'cn.zhzy.tveep.codeEditor.app',
        copyright: 'Copyright © 2022',
        publish: [
          {
            provider: 'generic',
            url: ''
          }
        ],
        nsis: {
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'zhzy-tveep-codeEditor',
          perMachine: true,
          oneClick: false
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        //productName 包名称 version 包版本(package.json)  ext后缀
        mac: {
          icon: 'public/icons/icon.icns',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        win: {
          icon: 'public/icons/icon.ico',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        linux: {
          icon: 'public/icons',
          artifactName: '${productName}_setup_${version}.${ext}'
        }
      }
    }
  }
}
