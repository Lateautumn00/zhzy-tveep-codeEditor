<!--
 * @Description: 下拉菜单
 * @Author: lanchao
 * @Date: 2022-06-04 16:33:27
 * @LastEditTime: 2022-06-05 15:41:28
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <el-dropdown :trigger="trigger" :placement="placement" :size="size">
    <slot />
    <template #dropdown>
      <el-dropdown-menu v-if="type === -1 || type === 0">
        <el-dropdown-item @click="createFile">新建文件</el-dropdown-item>
        <el-dropdown-item>新建文件夹</el-dropdown-item>
        <el-dropdown-item v-if="type === 0 ? true : false"
          >复制</el-dropdown-item
        >
        <el-dropdown-item v-if="type === 0 ? true : false"
          >粘贴</el-dropdown-item
        >
        <el-dropdown-item v-if="type === 0 ? true : false"
          >剪裁</el-dropdown-item
        >
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item v-if="type === 0 ? true : false"
          >重命名</el-dropdown-item
        >
        <el-dropdown-item v-if="type === 0 ? true : false" @click="removeNode"
          >删除</el-dropdown-item
        >
      </el-dropdown-menu>
      <el-dropdown-menu v-if="type === 1">
        <el-dropdown-item @click="openFile">打开</el-dropdown-item>
        <el-dropdown-item>复制</el-dropdown-item>
        <el-dropdown-item>剪裁</el-dropdown-item>
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item>重命名</el-dropdown-item>
        <el-dropdown-item @click="removeNode">删除</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu v-if="type === 2">
        <el-dropdown-item
          @click="saveFile"
          :disabled="!data.state ? true : false"
          >保存</el-dropdown-item
        >
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item
          @click="removeTab(3)"
          :disabled="data.state ? true : false"
          >关闭</el-dropdown-item
        >
        <el-dropdown-item @click="removeTab(2)">关闭已保存</el-dropdown-item>
        <el-dropdown-item @click="removeTab(1)">关闭其他</el-dropdown-item>
        <el-dropdown-item
          :disabled="data.state ? true : false"
          @click="removeTab(0)"
          >关闭全部</el-dropdown-item
        >
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
    size: String,
    data: Object
  }
  //   watch: {
  //     data: [
  //       {
  //         handler: 'dataWatch',
  //         immediate: true,
  //         deep: true
  //       }
  //     ]
  //   }
})
export default class DropdownComponent extends Vue {
  trigger = 'click' //触发方式 click/focus/hover/contextmenu
  placement = 'bottom' //位置 top/top-start/top-end/bottom/bottom-start/bottom-end
  type = 0 //0目录1文件
  size = 'default' //large / default / small
  data: any
  //   dataWatch(newValue: any, oldValue: any) {
  //     console.log('监听到222....', this.type, newValue, oldValue)
  //   }
  //打开文件 tree
  openFile() {
    this.$emit('handleNodeClick', this.data)
  }
  createFile() {
    this.$emit('createFile', this.data, (this.$parent as any).node)
  }
  //删除
  removeNode() {
    this.$emit('removeNode', (this.$parent as any).node)
  }
  //复制路径 all
  copyFile() {
    ;(window as any).$electron.clipboard.writeText(this.data.src)
  }
  //保存文件 tabs
  saveFile() {
    this.$emit('saveFile', this.data.key)
  }
  //关闭文件 tabs
  removeTab(k: number) {
    this.$emit('removeTab', this.data.key, k)
  }
}
</script>
<style scoped lang="scss">
.el-dropdown {
  line-height: unset;
}
</style>
