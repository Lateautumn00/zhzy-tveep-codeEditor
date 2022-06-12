/*
 * @Description:自定义菜单
 * @Author: lanchao
 * @Date: 2022-06-01 18:36:21
 * @LastEditTime: 2022-06-12 18:37:53
 * @LastEditors: lanchao
 * @Reference:
 */
export function menu(window: any, Menu: any, dialog: any) {
  //openfile 选择文件
  //openDirectory 选择文件夹
  //multiSelection 多选
  //showHiddenFiles 显示隐藏文件
  //createDirectory 创建文件夹
  const template: any = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开文件',
          click: function () {
            dialog
              .showOpenDialog({
                properties: ['openFile']
              })
              .then((result: any) => {
                window.webContents.send('menuOpenFile', result.filePaths[0])
              })
          }
        },
        {
          label: '打开文件夹',
          click: function () {
            dialog
              .showOpenDialog({
                properties: ['openDirectory']
              })
              .then((result: any) => {
                window.webContents.send(
                  'menuOpenDirectory',
                  result.filePaths[0]
                )
              })
          }
        },
        {
          label: '保存',
          accelerator: process.platform === 'darwin' ? 'Ctrl+S' : 'Ctrl+S',
          click: function () {
            window.webContents.send('menuPreservation')
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
//右键菜单
// export function rightMenu() {
//   const remote = require('electron').remote
//   const Menu = remote.Menu
//   //定义菜单
//   const template = [
//     {
//       label: '文件',
//       submenu: [
//         {
//           label: '新建文件',

//           accelerator: 'ctrl+n',

//           click: function () {
//             console.log('ctrl+n')
//           }
//         },
//         {
//           label: '新建窗口',
//           click: function () {
//             console.log('new window')
//           }
//         }
//       ]
//     },
//     {
//       label: '编辑',
//       submenu: [
//         {
//           label: '复制',
//           role: 'copy'
//         },
//         {
//           label: '截切',
//           role: 'cut'
//         }
//       ]
//     }
//   ]

//   const m = Menu.buildFromTemplate(template)

//   Menu.setApplicationMenu(m)

//   //右键菜单

//   window.addEventListener(
//     'contextmenu',
//     function (e) {
//       // alert('1212')

//       //阻止当前窗口默认事件
//       e.preventDefault()
//       //在当前窗口点击右键的时候弹出  定义的菜单模板
//       m.popup({ window: remote.getCurrentWindow() })
//     },
//     false
//   )
// }
