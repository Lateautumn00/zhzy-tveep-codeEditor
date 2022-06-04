<!--
 * @Description: 下拉菜单
 * @Author: lanchao
 * @Date: 2022-06-04 16:33:27
 * @LastEditTime: 2022-06-04 18:32:11
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <el-dropdown :trigger="trigger" :placement="placement" :size="size">
    <slot />
    <template #dropdown>
      <el-dropdown-menu v-if="type === 0">
        <el-dropdown-item>新建文件</el-dropdown-item>
        <el-dropdown-item>新建文件夹</el-dropdown-item>
        <el-dropdown-item>复制</el-dropdown-item>
        <el-dropdown-item>粘贴</el-dropdown-item>
        <el-dropdown-item>剪裁</el-dropdown-item>
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item>重命名</el-dropdown-item>
        <el-dropdown-item>删除</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu v-if="type === 1">
        <el-dropdown-item @click="openFile">打开</el-dropdown-item>
        <el-dropdown-item>复制</el-dropdown-item>
        <el-dropdown-item>剪裁</el-dropdown-item>
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item>重命名</el-dropdown-item>
        <el-dropdown-item>删除</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
@Options({
  components: {},
  props: {
    trigger: String,
    placement: String,
    type: Number,
    size: String
  }
})
export default class DropdownComponent extends Vue {
  trigger = 'click' //触发方式 click/focus/hover/contextmenu
  placement = 'bottom-start' //位置 top/top-start/top-end/bottom/bottom-start/bottom-end
  type = 0 //0目录1文件
  size = 'default' //large / default / small
  openFile() {
    this.$emit('handleNodeClick', (this as any).$parent.node.data)
  }
  //复制路径
  copyFile() {
    ;(window as any).$clipboard.writeText((this as any).$parent.node.data.src)
    ;(this as any).$message.success('复制成功')
  }
}
</script>
