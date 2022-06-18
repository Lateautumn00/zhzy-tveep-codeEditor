<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 15:42:12
 * @LastEditTime: 2022-06-12 19:53:27
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="left">
    <img src="../assets/logo.png" class="logo" />
    <el-dropdown trigger="click" placement="bottom" size="default">
      <span>文件</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="menuOpenFile">打开文件</el-dropdown-item>
          <el-dropdown-item @click="menuOpenDirectory"
            >打开文件夹</el-dropdown-item
          >
          <el-dropdown-item @click="menuPreservation"
            >保存 (Ctrl+S)</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
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
  //打开文件
  menuOpenFile() {
    ;(window as any).$electron.ipcRenderer.send('app-menuOpenFile')
  }
  //打开文件夹
  menuOpenDirectory() {
    ;(window as any).$electron.ipcRenderer.send('app-menuOpenDirectory')
  }
  //保存
  menuPreservation() {
    ;(window as any).$electron.ipcRenderer.send('app-menuPreservation')
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
@use '@/assets/style/default.scss';
@use '@/assets/style/extends.scss';
@use '@/assets/style/mixin.scss' as mixin;

.left {
  @include mixin.set-flex(null, center);
  .logo {
    @include mixin.set-radius(30px, 30px, 50%);
    margin-right: 6px;
  }
  .el-dropdown--default > span {
    @extend %no-drag;
  }
}

.right {
  @include mixin.set-flex(space-between);
  @include mixin.widthOrHeight(60px);
  margin-left: auto;

  .el-icon {
    @extend %no-drag;
  }
}
</style>
