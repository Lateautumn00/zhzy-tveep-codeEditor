import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { upgradeHandle } from '@/upgrade'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
//import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let win: any = null
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    useContentSize: true,
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    //transparent: true, //窗口透明  设置后还原窗口win.restore()无效
    //backgroundColor: '#000', //背景颜色
    title: '知乎者也', //标题
    autoHideMenuBar: true, //是否隐藏菜单栏
    frame: false, //无边框   不使用无边框模式 需要屏蔽掉  并将router/index.ts 路由中的替换  原始边框路由
    movable: true,
    webPreferences: {
      // Required for Spectron testing
      //enableRemoteModule: !!process.env.IS_TEST,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'), //预加载
      webSecurity: false //解决跨域
    }
  })
  if (process.env.NODE_ENV === 'production') {
    //正式
    createProtocol('app')
    win.loadURL('app://./index.html') // Load the index.html when not in development
    if (process.env.VUE_APP_UPLOAD !== '')
      upgradeHandle(win, process.env.VUE_APP_UPLOAD) //检测版本更新
    //win.webContents.openDevTools()
  } else {
    //开发
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  }

  // 当应用所有窗口关闭要做的事情
  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  //外网 加载慢 去掉
  //   if (isDevelopment && !process.env.IS_TEST) {
  //     // Install Vue Devtools
  //     try {
  //       await installExtension(VUEJS3_DEVTOOLS)
  //     } catch (e) {
  //       console.error('Vue Devtools failed to install:', e.toString())
  //     }
  //   }
  if (win === null) createWindow()
})
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
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
ipcMain.on('app-close', function () {
  //win.close() //在设置无边框后失效
  win = null //主窗口设置为null 防止内存溢出
  app.exit() //直接退出应用程序
})
