<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:02:45
 * @LastEditTime: 2022-06-02 11:25:55
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
import { getDirContent } from '@/modular/fsModular'

export default class LeftComponent extends Vue {
  // eslint-disable-next-line no-undef
  data: any = []
  dirLocal = '' //本地缓存文件夹地址
  mounted() {
    this.$nextTick(async () => {
      this.dirLocal = (window as any).localStorage.getItem('menuOpenDirectory')
      if (this.dirLocal) {
        const defaultDir = await getDirContent(this.dirLocal)
        this.data = defaultDir.children
      }
      //监听ipc消息
      ;(window as any).ipcRenderer.on(
        'menuOpenDirectory',
        async (event: any, result: any) => {
          this.dirLocal = result
          this.data = []
          const dir = await getDirContent(result)
          this.data = dir.children
          ;(window as any).localStorage.setItem('menuOpenDirectory', result) //将本次的文件夹目录写入缓存
        }
      )
    })
  }
  defaultProps = {
    label: 'label',
    src: 'src',
    children: 'children',
    type: 'type'
  }

  // eslint-disable-next-line no-undef
  handleNodeClick = (value: TreeList) => {
    if (value.type === 1) {
      //去读取文件
      this.$emit('addTab', value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
