/*
 * @Description: 渲染进程 发的
 * @Author: lanchao
 * @Date: 2022-06-12 19:01:36
 * @LastEditTime: 2022-06-12 19:18:57
 * @LastEditors: lanchao
 * @Reference:
 */
export function ipcMainHandle(win: any, ipcMain: any, dialog: any, app: any) {
  //登录窗口最小化
  ipcMain.on('app-min', function () {
    win.minimize()
  })
  //登录窗口最大化、还原窗口
  ipcMain.on('app-max', function () {
    if (win.isMaximized()) {
      win.restore()
    } else {
      win.maximize()
    }
  })
  //关闭
  ipcMain.on('app-close', function () {
    //win.close() //在设置无边框后失效
    win = null //主窗口设置为null 防止内存溢出
    app.exit() //直接退出应用程序
  })
  //打开文件
  ipcMain.on('app-menuOpenFile', function () {
    dialog
      .showOpenDialog({
        properties: ['openFile']
      })
      .then((result: any) => {
        win.webContents.send('menuOpenFile', result.filePaths[0])
      })
  })
  //打开文件夹
  ipcMain.on('app-menuOpenDirectory', function () {
    dialog
      .showOpenDialog({
        properties: ['openDirectory']
      })
      .then((result: any) => {
        win.webContents.send('menuOpenDirectory', result.filePaths[0])
      })
  })
  //保存
  ipcMain.on('app-menuPreservation', function () {
    win.webContents.send('menuPreservation')
  })
}
