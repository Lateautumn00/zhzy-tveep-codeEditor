/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-06-02 11:21:16
 * @LastEditTime: 2022-06-17 16:14:54
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
  rename,
  copyFile
} from 'fs/promises'
import path from 'path'
import fs from 'fs'
import { TreeList } from '@/types/tree'
/**
 * 获取文件夹下所有子文件   文件越多越满
 * @param _dir 文件夹路径
 * @returns
 */
export const getDirContent = async (_dir: string) => {
  const list: TreeList = {
    index: 3,
    key: '-1',
    label: path.basename(_dir),
    src: _dir,
    isLeaf: false,
    state: 0,
    children: []
  }
  let dirNum = 0 //下次放文件夹的位置
  const dirs = await readdir(_dir) //读文件
  for (const value of dirs) {
    const newDir = path.join(_dir, value)
    const stats = await getStat(newDir)
    if (stats.isDirectory()) {
      //如果是文件夹
      //list.key = `${stats.ino}`
      const dirData = await getDirContent(newDir)
      dirData.key = `${stats.ino}`
      list.children.splice(dirNum, 0, dirData)
      dirNum++
    } else if (stats.isFile()) {
      //如果是文件
      list.children.push({
        index: 4,
        key: `${stats.ino}`,
        label: value,
        src: newDir,
        isLeaf: true,
        state: 0,
        children: []
      })
    }
  }
  return list
}
//获取一层文件
export const getDirContentOne = async (_dir: string) => {
  const list: TreeList = {
    index: 3,
    key: '-1',
    label: path.basename(_dir),
    src: _dir,
    isLeaf: false, //0文件夹1 文件
    state: 0,
    children: []
  }
  let dirNum = 0 //下次放文件夹的位置
  const dirs = await readdir(_dir) //读文件
  for (const value of dirs) {
    const newDir = path.join(_dir, value)
    const stats = await getStat(newDir)
    if (stats.isDirectory()) {
      //如果是文件夹
      list.children.splice(dirNum, 0, {
        index: 3,
        key: `${stats.ino}`,
        label: value,
        src: newDir,
        isLeaf: false,
        state: 0,
        children: []
      })
      dirNum++
    } else if (stats.isFile()) {
      //如果是文件
      list.children.push({
        index: 4,
        key: `${stats.ino}`,
        label: value,
        src: newDir,
        isLeaf: true,
        state: 0,
        children: []
      })
    }
  }
  return list
}
//获取stat
export const getStat = async (dir: string) => {
  return await stat(dir)
}
/**
 * 读取文件内容
 * @param fileDir
 */
export const getFileContent = async (fileDir: string) => {
  // if (!fs.existsSync(fileDir)) throw new Error('源文件不存在') //如果源文件不存在
  return await readFile(fileDir, 'utf-8')
}
//目录下创建文件 文件夹
export const createFilePath = async (
  type: boolean,
  fileDir: string,
  name: string
) => {
  if (!fs.existsSync(fileDir)) throw new Error('源文件不存在') //如果源文件不存在 z
  const newPath = path.join(fileDir, name)
  !type ? await mkdir(newPath) : await writeFile(newPath, ' ')
  const stat = await getStat(newPath)
  return {
    index: type ? 4 : 3,
    key: `${stat.ino}`,
    label: name,
    src: newPath,
    isLeaf: type,
    state: 0,
    children: []
  }
}
//重命名
export const renameFile = async (oldDir: string, name: string) => {
  if (!fs.existsSync(oldDir)) throw new Error('源文件不存在') //如果源文件不存在
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
  if (!fs.existsSync(fileDir)) throw new Error('源文件不存在') //如果源文件不存在
  const stats = await getStat(fileDir)
  let type = ''
  if (stats.isDirectory()) {
    type = 'dir'
    await deleteDir(fileDir)
  } else if (stats.isFile()) {
    type = 'file'
    await unlink(fileDir)
  }
  return type
}
//删除文件夹 (待完成)
export const deleteDir = async (fileDir: string) => {
  if (!fs.existsSync(fileDir)) throw new Error('源文件不存在') //如果源文件不存在
  const files = await readdir(fileDir)
  for (const item of files) {
    const item_path = path.join(fileDir, item)
    const stats = await getStat(item_path)
    if (stats.isDirectory()) {
      await deleteDir(item_path)
    } else {
      await unlink(item_path)
    }
  }
  await rmdir(fileDir)
}
//拷贝文件
/**
 * source 源文件
 * target 目标地址
 */
export const copyFiles = async (
  type: boolean,
  source: string,
  target: string
) => {
  if (!fs.existsSync(source)) throw new Error('源文件不存在') //如果源文件不存在
  const name = path.basename(source)
  const targetDir = path.join(target, name)
  if (fs.existsSync(targetDir)) throw new Error('新文件已存在') //如果新文件已存在
  !type
    ? await copyDirectory(source, targetDir)
    : await copyFile(source, targetDir, 1)
  return targetDir
}
//拷贝目录
export const copyDirectory = async (source: string, target: string) => {
  if (!fs.existsSync(source)) throw new Error('源文件不存在1') //如果源文件不存在
  if (!fs.existsSync(target)) await mkdir(target) //如果目标文件不存在创建
  const dirs = await readdir(source)
  dirs.forEach(async (item: any) => {
    const item_path = path.join(source, item)
    const stats = await getStat(item_path)
    if (stats.isFile()) {
      // 是文件
      copyFile(item_path, path.join(target, item))
    } else if (stats.isDirectory()) {
      // 是目录
      copyDirectory(item_path, path.join(target, item))
    }
  })
  return true
}
//移动文件
/**
 *
 * @param type 源文件类型 true 文件 fasle 文件夹
 * @param source
 * @param target
 * @returns
 */
export const moveFile = async (
  type: boolean,
  source: string,
  target: string
) => {
  if (!fs.existsSync(source)) throw new Error('源文件不存在') //如果源文件不存在
  const name = path.basename(source) //获取文件名
  const targetDir = path.join(target, name) //新的路径
  if (fs.existsSync(targetDir)) throw new Error('新文件已存在') //如果源文件不存在
  await rename(source, targetDir)
  const stat = await getStat(targetDir)
  return {
    index: type ? 4 : 3,
    key: `${stat.ino}`,
    label: name,
    src: targetDir,
    isLeaf: type,
    state: 0,
    children: []
  }
}
