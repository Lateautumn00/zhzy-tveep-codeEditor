<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 15:42:12
 * @LastEditTime: 2022-06-05 10:33:14
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="left">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-sub-menu index="a">
        <template #title>文件</template>
        <el-menu-item index="a1">新建文件</el-menu-item>
        <el-menu-item index="a2">新建文件夹</el-menu-item>
        <el-menu-item index="a3">打开文件夹</el-menu-item>
        <el-menu-item index="a4">打开文件</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="b"> 编辑 </el-menu-item>
    </el-menu>
  </div>
  <div class="right">
    <el-icon @click="semiWin"><SemiSelect /></el-icon>
    <el-icon v-if="isMax" @click="fullWin"><FullScreen /></el-icon>
    <el-icon v-if="!isMax" @click="noFullWin"><CopyDocument /></el-icon>
    <el-icon @click="closeWin"><Close /></el-icon>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
export default class HeaderComponent extends Vue {
  isMax = false //是否最大化
  activeIndex = 'a'
  //选择打开文件 文件夹  新建文件  新建文件夹等
  handleSelect(key: string, keyPath: string[]) {
    console.log(key, keyPath)
    if (key === 'a3') {
      ;(this.$refs.fileRef as any).dispatchEvent(new MouseEvent('click'))
    }
  }

  closeWin() {
    ;(window as any).$electron.ipcRenderer.send('app-close')
  }
  semiWin() {
    ;(window as any).$electron.ipcRenderer.send('app-min')
  }
  fullWin() {
    this.isMax = false
    ;(window as any).$electron.ipcRenderer.send('app-max')
  }
  noFullWin() {
    this.isMax = true
    ;(window as any).$electron.ipcRenderer.send('app-max')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.left {
  -webkit-app-region: no-drag;
}
.right {
  -webkit-app-region: no-drag;
  display: flex;
  justify-content: space-between;
  width: 60px;
  margin-left: auto;
  cursor: pointer;
}
</style>
