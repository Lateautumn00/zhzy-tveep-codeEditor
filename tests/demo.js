// eslint-disable-next-line @typescript-eslint/no-var-requires
// const fs = require('fs')
// //const { readFile } = require('fs/promises')
// //eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path')
// function getDirOfFiles(dir) {
//   // eslint-disable-next-line no-undef
//   let id = 1
//   const list = {
//     label: path.basename(dir),
//     src: dir,
//     children: []
//   }
//   let dirNum = 0
//   const dirs = fs.readdirSync(dir) //读文件
//   dirs.forEach((value) => {
//     const newDir = path.join(dir, value)
//     const stat = fs.statSync(newDir)
//     if (stat.isDirectory()) {
//       console.log(++id)
//       //如果是文件夹
//       list.children.splice(dirNum, 0, getDirOfFiles(newDir))
//       dirNum++
//     } else if (stat.isFile()) {
//       //如果是文件
//       console.log(++id)
//       list.children.push({
//         label: value,
//         src: newDir,
//         children: []
//       })
//     }
//   })
//   return list
// }
// const data = getDirOfFiles('H:/data/me/github/zhzy-tveep-codeEditor/src')
//console.log(data.children)
// const getFile = async (fileDir) => {
//   const body = await readFile(fileDir, 'utf-8')
//   console.log(body)
//   return body
// }
// getFile('H:/data/me/github/zhzy-tveep-codeEditor/vue.config.js')

let tabsValue = '1'
let tabs = [{ key: '1', name: 'a1' }]
function removeTab(key) {
  tabs.splice(Number(key) - 1, 1)
  tabs.forEach((value, index) => {
    if (value.key > key) {
      const newKey = `${Number(value.key) - 1}`
      if (value.key === tabsValue) {
        tabsValue = newKey
      }
      value.key = newKey
    }
  })
  if (tabsValue > tabs.length) tabsValue = tabs.length
  console.log(tabsValue, tabs)
}
removeTab('1')
