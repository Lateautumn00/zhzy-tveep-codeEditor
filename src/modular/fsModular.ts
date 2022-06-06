/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-06-02 11:21:16
 * @LastEditTime: 2022-06-06 19:30:35
 * @LastEditors: lanchao
 * @Reference:
 */
import {
  readFile,
  writeFile,
  stat,
  readdir,
  unlink,
  rmdir,
  mkdir,
  rename
} from 'fs/promises'
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
//目录下创建文件 文件夹
export const createFilePath = async (
  type: number,
  fileDir: string,
  name: string
) => {
  const newPath = path.join(fileDir, name)
  type === 0 ? await mkdir(newPath) : await writeFile(newPath, ' ')
  return newPath
}
//重命名
export const renameFile = async (oldDir: string, name: string) => {
  const fileDir = path.dirname(oldDir)
  const newDir = path.join(fileDir, name)
  await rename(oldDir, newDir)
  return newDir
}
//写入文件
export const setFileContent = async (fileDir: string, content: string) => {
  return await writeFile(fileDir, content)
}
//删除文件\文件夹
export const deleteFile = async (fileDir: string) => {
  const stats = await stat(fileDir)
  if (stats.isDirectory()) {
    return await deleteDir(fileDir)
  } else if (stats.isFile()) {
    return await unlink(fileDir)
  }
}
//删除文件夹 (待完成)
const deleteDir = async (fileDir: string) => {
  console.log('未完')
}
