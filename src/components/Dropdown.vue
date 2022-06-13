<!--
 * @Description: 下拉菜单
 * @Author: lanchao
 * @Date: 2022-06-04 16:33:27
 * @LastEditTime: 2022-06-12 17:05:32
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <el-dropdown :trigger="trigger" :placement="placement" :size="size">
    <slot />
    <template #dropdown>
      <el-dropdown-menu v-if="index === 2 || index === 3">
        <el-dropdown-item @click="createDialog('create', true)"
          >新建文件</el-dropdown-item
        >
        <el-dropdown-item @click="createDialog('create', false)"
          >新建文件夹</el-dropdown-item
        >
        <el-dropdown-item v-if="index === 3 ? true : false" @click="copyOrMove"
          >复制</el-dropdown-item
        >
        <el-dropdown-item
          :disabled="!pasteData.src ? true : false"
          @click="paste"
          >粘贴</el-dropdown-item
        >
        <!-- <el-dropdown-item v-if="index === 3 ? true : false"
          >剪裁</el-dropdown-item
        > -->
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item
          v-if="index === 3 ? true : false"
          @click="createDialog('basename', false)"
          >重命名</el-dropdown-item
        >
        <!-- <el-dropdown-item v-if="index === 3 ? true : false" @click="removeNode"
          >删除</el-dropdown-item
        > -->
      </el-dropdown-menu>
      <el-dropdown-menu v-if="index === 4">
        <el-dropdown-item @click="openFile">打开</el-dropdown-item>
        <el-dropdown-item @click="copyOrMove">复制</el-dropdown-item>
        <!-- <el-dropdown-item>剪裁</el-dropdown-item> -->
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item @click="createDialog('basename', true)"
          >重命名</el-dropdown-item
        >
        <el-dropdown-item @click="removeNode">删除</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu v-if="index === 5">
        <el-dropdown-item
          @click="saveFile"
          :disabled="!dataList.state ? true : false"
          >保存 （Ctrl+S）</el-dropdown-item
        >
        <el-dropdown-item @click="copyFile">复制路径</el-dropdown-item>
        <el-dropdown-item
          @click="closeTab(3)"
          :disabled="dataList.state ? true : false"
          >关闭</el-dropdown-item
        >
        <el-dropdown-item @click="closeTab(2)">关闭已保存</el-dropdown-item>
        <el-dropdown-item @click="closeTab(1)">关闭其他</el-dropdown-item>
        <el-dropdown-item
          :disabled="dataList.state ? true : false"
          @click="closeTab(0)"
          >关闭全部</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { TreeList } from '@/types/tree'
@Options({
  components: {},
  props: {
    trigger: String,
    placement: String,
    index: Number,
    size: String,
    dataList: Object,
    pasteData: Object
  },
  emits: {
    handleNodeClick: null,
    createDialog: null,
    removeNode: null,
    copyOrMove: null,
    paste: null,
    saveFile: null,
    closeTab: null
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
  index = 0 // 1已打开文件树根节点 2文件树根节点 3目录 4文件 5tab
  size = 'default' //large / default / small
  dataList: TreeList = {
    index: 0,
    key: '',
    label: '',
    src: '',
    isLeaf: false,
    state: 1,
    children: []
  }
  pasteData: any //是否可粘贴
  //   dataWatch(newValue: any, oldValue: any) {
  //     console.log('监听到222....', this.type, newValue, oldValue)
  //   }
  //打开文件 tree
  openFile() {
    this.$emit('handleNodeClick', this.dataList)
  }
  createDialog(tag: string, type: boolean) {
    this.$emit('createDialog', tag, type, this.dataList)
  }
  //删除
  removeNode() {
    this.$emit('removeNode', this.dataList)
  }
  //复制文件
  copyOrMove() {
    this.$emit('copyOrMove', this.dataList)
  }
  //粘贴
  paste() {
    this.$emit('paste', this.dataList)
  }
  //复制路径 all
  copyFile() {
    ;(window as any).$electron.clipboard.writeText(this.dataList.src)
  }
  //保存文件 tabs
  saveFile() {
    this.$emit('saveFile', this.dataList.key)
  }
  //关闭文件 tabs
  closeTab(k: number) {
    this.$emit('closeTab', this.dataList.key, k)
  }
}
</script>
<style scoped lang="scss">
.el-dropdown {
  line-height: unset;
}
</style>
