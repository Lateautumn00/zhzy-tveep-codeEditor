<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 15:42:12
 * @LastEditTime: 2022-05-25 09:33:07
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="header">
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
  closeWin = () => {
    ;(window as any).ipcRenderer.send('app-close')
  }
  semiWin = () => {
    ;(window as any).ipcRenderer.send('app-min')
  }
  fullWin = () => {
    this.isMax = false
    ;(window as any).ipcRenderer.send('app-max')
  }
  noFullWin = () => {
    this.isMax = true
    ;(window as any).ipcRenderer.send('app-max')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  -webkit-app-region: no-drag;
  display: flex;
  justify-content: space-between;
  width: 60px;
  margin-left: auto;
  cursor: pointer;
}
</style>
