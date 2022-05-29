/*
 * @Description:升级版本
 * @Author: lanchao
 * @Date: 2022-01-17 15:09:28
 * @LastEditTime: 2022-05-27 09:46:07
 * @LastEditors: lanchao
 * @Reference:
 */
import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
let mainWindow: any = null
export function upgradeHandle(window: any, feedUrl: any) {
  const msg = {
    error: '检查更新出错 ...',
    checking: '正在检查更 ...',
    updateAva: '检测到新版本 ...',
    updateNotAva: '已经是最新版本 ...',
    downloadProgress: '正在下载新版本 ...',
    downloaded: '下载完成，开始更新 ...'
  }
  mainWindow = window
  autoUpdater.autoDownload =
    process.env.VUE_APP_UPGRADE === 'automatic' ? true : false //true 自动升级 false 手动升级
  //设置更新包的地址
  autoUpdater.setFeedURL(feedUrl)

  //监听升级失败事件
  autoUpdater.on('error', function (message: any) {
    sendUpdateMessage({
      cmd: 'error',
      title: msg.error,
      message: message
    })
  })
  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function (message: any) {
    sendUpdateMessage({
      cmd: 'checking-for-update',
      title: msg.checking,
      message: message
    })
  })
  //监听发现可用更新事件
  autoUpdater.on('update-available', function (message: any) {
    sendUpdateMessage({
      cmd: 'update-available',
      title: msg.updateAva,
      message: message
    })
  })
  //监听没有可用更新事件
  autoUpdater.on('update-not-available', function (message: any) {
    sendUpdateMessage({
      cmd: 'update-not-available',
      title: msg.updateNotAva,
      message: message
    })
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (message: any) {
    sendUpdateMessage({
      cmd: 'download-progress',
      title: msg.downloadProgress,
      message: message
    })
  })
  //监听下载完成事件
  autoUpdater.on(
    'update-downloaded',
    function (
      event: any,
      releaseNotes: any,
      releaseName: any,
      releaseDate: any,
      updateUrl: any
    ) {
      sendUpdateMessage({
        cmd: 'update-downloaded',
        title: msg.downloaded,
        message: {
          releaseNotes,
          releaseName,
          releaseDate,
          updateUrl
        }
      })
      //退出并安装更新包
      autoUpdater.quitAndInstall()
    }
  )

  //接收渲染进程消息，开始检查更新
  ipcMain.on('checkForUpdate', () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates()
  })
  ipcMain.on('downloadUpdate', () => {
    // 下载
    autoUpdater.downloadUpdate()
  })
}
//给渲染进程发送消息
function sendUpdateMessage(text: any) {
  mainWindow.webContents.send('message', text)
}
