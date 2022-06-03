/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-06-02 11:21:16
 * @LastEditTime: 2022-06-03 15:42:55
 * @LastEditors: lanchao
 * @Reference:
 */
import { readFile, writeFile, stat, readdir } from 'fs/promises'
import path from 'path'
/**
 * 获取文件夹下所有子文件
 * @param _dir 文件夹路径
 * @returns
 */
export const getDirContent = async (_dir: string) => {
  // eslint-disable-next-line no-undef
  const list: TreeList = {
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
/**
 * 读取文件内容
 * @param fileDir
 */
export const getFileContent = async (fileDir: string) => {
  return await readFile(fileDir, 'utf-8')
}
export const setFileContent = async (fileDir: string, content: string) => {
  return await writeFile(fileDir, content)
}
