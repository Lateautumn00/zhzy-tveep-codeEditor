// eslint-disable-next-line @typescript-eslint/no-var-requires
//const fs = require('fs')
const { readFile, readdir, stat, writeFile } = require('fs/promises')
//eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
let d = 0
const getDirContent = async (_dir) => {
  const list = {
    id: ++d,
    label: path.basename(_dir),
    src: _dir,
    type: 0, //0文件夹1 文件
    state: 0,
    children: []
  }
  let dirNum = 0 //下次放文件夹的位置
  const dirs = await readdir(_dir) //读文件

  for (const value of dirs) {
    const newDir = path.join(_dir, value)
    const stats = await stat(newDir)
    if (stats.isDirectory()) {
      //如果是文件夹
      // list.children.push(getDirOfFiles(newDir))
      list.children.splice(dirNum, 0, await getDirContent(newDir))
      dirNum++
    } else if (stats.isFile()) {
      //如果是文件
      list.children.push({
        id: ++d,
        label: value,
        src: newDir,
        type: 1,
        state: 0,
        children: []
      })
    }
  }
  return list
}
getDirContent('H:/data/me/github/zhzy-tveep-codeEditor/src')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error('错误', err)
  })

//读取文件
// const getFile = async (fileDir) => {
//   const body = await readFile(fileDir, 'utf-8')
//   return body
// }
// getFile('H:/data/me/github/zhzy-tveep-codeEditor/vue1.config.js')
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((error) => {
//     console.error('错误', error)
//   })
// const setFileContent = async (fileDir, content) => {
//   return await writeFile(fileDir, content)
// }
// setFileContent('H:/data/me/github/zhzy-tveep-codeEditor/vue1.config.js', '222')
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((error) => {
//     console.error(error)
//   })
//删除节点 重排key
// let tabsValue = '1'
// let tabs = [{ key: '1', name: 'a1' }]
// function removeTab(key) {
//   tabs.splice(Number(key) - 1, 1)
//   tabs.forEach((value, index) => {
//     if (value.key > key) {
//       const newKey = `${Number(value.key) - 1}`
//       if (value.key === tabsValue) {
//         tabsValue = newKey
//       }
//       value.key = newKey
//     }
//   })
//   if (tabsValue > tabs.length) tabsValue = tabs.length
//   console.log(tabsValue, tabs)
// }
// removeTab('1')
// let a = {
//   label: '已打开文件',
//   src: '',
//   type: 0,
//   state: 0,
//   children: []
// }
// Object.defineProperty(a, 'k', {
//   value: 1,
//   enumerable: true,
//   configurable: false,
//   writable: false
// })
// console.log(a)
