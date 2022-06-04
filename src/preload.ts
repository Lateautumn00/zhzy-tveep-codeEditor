/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-04-14 11:21:23
 * @LastEditTime: 2022-06-04 18:02:10
 * @LastEditors: lanchao
 * @Reference:
 */
// All of the Node.js APIs are available in the preload process.// It has the same sandbox as a Chrome extension.
// import { contextBridge, ipcRenderer } from 'electron'
// contextBridge.exposeInMainWorld('electron', { ipcRenderer }) //使用这种 会报错，因为contextIsolation：false是非安全的，设置为true  此文件就获取不到
import { ipcRenderer, clipboard } from 'electron'
;(window as any).$ipcRenderer = ipcRenderer
;(window as any).$clipboard = clipboard
