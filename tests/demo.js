// eslint-disable-next-line @typescript-eslint/no-var-requires
//const fs = require('fs')
const { readFile } = require('fs/promises')
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const path = require('path')
// function getDirOfFiles(dir) {
//   // eslint-disable-next-line no-undef
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
//       //如果是文件夹
//       list.children.splice(dirNum, 0, getDirOfFiles(newDir))
//       dirNum++
//     } else if (stat.isFile()) {
//       //如果是文件
//       list.children.push({
//         label: value,
//         src: newDir,
//         children: []
//       })
//     }
//   })
//   return list
// }
// const data = getDirOfFiles('H:/data/me/github/zhzy-tveep-codeEditor')
// console.log(data.children)
const getFile = async (fileDir) => {
  const body = await readFile(fileDir, 'utf-8')
  console.log(body)
  return body
}
getFile('H:/data/me/github/zhzy-tveep-codeEditor/vue.config.js')
