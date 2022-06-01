<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:02:45
 * @LastEditTime: 2022-06-01 20:05:56
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="left">
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import fs from 'fs'
import path from 'path'

export default class LeftComponent extends Vue {
  // eslint-disable-next-line no-undef
  data: any = []
  dirLocal = '' //本地缓存文件夹地址
  mounted() {
    this.$nextTick(() => {
      this.dirLocal = (window as any).localStorage.getItem('menuOpenDirectory')
      if (this.dirLocal) {
        const defaultDir = this.getDirOfFiles(this.dirLocal)
        this.data = defaultDir.children
      }
      //监听ipc消息
      ;(window as any).ipcRenderer.on(
        'menuOpenDirectory',
        (event: any, result: any) => {
          const dir = this.getDirOfFiles(result)
          this.data = dir.children
          this.dirLocal = result
          ;(window as any).localStorage.setItem('menuOpenDirectory', result) //将本次的文件夹目录写入缓存
        }
      )
    })
  }
  //获取目录下的所有文件
  getDirOfFiles(dir: string) {
    // eslint-disable-next-line no-undef
    const list: TreeList = {
      label: path.basename(dir),
      src: dir,
      children: []
    }
    let dirNum = 0 //下次放文件夹的位置
    const dirs = fs.readdirSync(dir) //读文件
    dirs.forEach((value) => {
      const newDir = path.join(dir, value)
      const stat = fs.statSync(newDir)
      if (stat.isDirectory()) {
        //如果是文件夹
        // list.children.push(getDirOfFiles(newDir))
        list.children.splice(dirNum, 0, this.getDirOfFiles(newDir))
        dirNum++
      } else if (stat.isFile()) {
        //如果是文件
        list.children.push({
          label: value,
          src: newDir,
          children: []
        })
      }
    })
    return list
  }
  defaultProps = {
    label: 'label',
    src: 'src',
    children: 'children'
  }

  handleNodeClick = (data: any) => {
    console.log(data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
