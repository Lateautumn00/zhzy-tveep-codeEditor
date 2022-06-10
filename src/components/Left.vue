<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:02:45
 * @LastEditTime: 2022-06-08 12:17:54
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="left">
    <el-tree
      ref="tree"
      :data="openData"
      :props="defaultProps"
      highlight-current
      @node-click="handleNodeClick"
      node-key="key"
    >
      <template #default="{ data }">
        <DropdownComponent
          trigger="contextmenu"
          :type="data.type"
          placement="bottom"
          size="large"
          :dataList="data"
          :pasteData="pasteData"
          @handleNodeClick="handleNodeClick"
          @createDialog="createDialog"
          @removeNode="removeNode"
          @copyOrMove="copyOrMove"
          @paste="paste"
        >
          <span class="custom-tree-node">
            <el-icon v-if="data.state === 1"><Edit /></el-icon>
            <span>{{ data.label }}</span>
          </span>
        </DropdownComponent>
      </template>
    </el-tree>
    <el-tree
      ref="tree"
      :data="dataList"
      :props="defaultProps"
      highlight-current
      @node-click="handleNodeClick"
      node-key="key"
    >
      <template #default="{ data }">
        <DropdownComponent
          trigger="contextmenu"
          :type="data.type"
          placement="bottom"
          size="large"
          :dataList="data"
          :pasteData="pasteData"
          @handleNodeClick="handleNodeClick"
          @createDialog="createDialog"
          @removeNode="removeNode"
          @copyOrMove="copyOrMove"
          @paste="paste"
        >
          <span class="custom-tree-node">
            <el-icon v-if="data.state === 1"><Edit /></el-icon>
            <span>{{ data.label }}</span>
          </span>
        </DropdownComponent>
      </template>
    </el-tree>
    <DialogComponent ref="dialog" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DropdownComponent from '@/components/Dropdown.vue'
import { DialogData } from '@/types/dialog'
import {
  getDirContent,
  deleteFile,
  createFilePath,
  renameFile,
  getStat,
  copyFiles
} from '@/modular/fsModular'
import DialogComponent from '@/components/Dialog.vue'
import { TreeList } from '@/types/tree'
@Options({
  components: {
    DropdownComponent,
    DialogComponent
  },
  props: {
    openData: Object,
    dataList: Object
  }
})
export default class LeftComponent extends Vue {
  defaultProps = {
    key: 'ino',
    label: 'label',
    src: 'src',
    children: 'children',
    type: 'type',
    state: 0 //状态 0 未有修改 1 有修改 1
  }
  openData: TreeList[] = []
  dataList: TreeList[] = []
  pasteData = {
    type: 0, //1复制文件 0复制文件夹 3剪裁文件 4 剪裁文件夹
    src: ''
  } //是否可粘贴
  xNodeKey = '' //当前操作的

  //打开文件
  handleNodeClick = (value: TreeList) => {
    if (value.type === 1) {
      //去读取文件
      this.$emit('leftBrotherEvents', { name: 'addTab', value: value })
    }
  }
  //创建文件
  createDialog(type: number, data: TreeList) {
    this.xNodeKey = `${data.key}`
    const title = type === 1 ? '创建文件' : type === 0 ? '创建文件夹' : '重命名'
    const name = type === 2 || type === 3 ? data.label : ''
    ;(this.$refs.dialog as any).openDialog({
      title,
      type: type,
      src: data.src,
      name
    })
  }
  //创建文件 文件夹
  operationFile(data: DialogData) {
    if (data.type === 2 || data.type === 3) {
      //重命名
      renameFile(data.src, data.name)
        .then(async (res: any) => {
          const xNode = (this.$refs.tree as any).getNode(this.xNodeKey)
          const oldSrc = xNode.data.src
          xNode.data.label = data.name
          xNode.data.src = res
          if (data.type === 3) {
            getDirContent(res)
              .then(async (result: TreeList) => {
                ;(this.$refs.tree as any).updateKeyChildren(
                  this.xNodeKey,
                  result.children
                )
              })
              .catch((error: any) => {
                console.error(error)
              })
          }
          this.$emit('leftBrotherEvents', {
            name: 'updateTab',
            value: {
              xNode: xNode.data,
              type: data.type,
              oldSrc
            }
          }) //通知right
        })
        .catch((error: any) => {
          console.log(error)
          ;(this as any).$message.error('错误')
        })
    } else {
      //创建文件 文件夹
      createFilePath(data.type, data.src, data.name)
        .then(async (res: any) => {
          const stat = await getStat(res)
          const v = {
            key: `${stat.ino}`,
            label: data.name,
            src: res,
            type: data.type,
            state: 0,
            children: []
          }
          const xNode = (this.$refs.tree as any).getNode(this.xNodeKey)
          ;(this.$refs.tree as any).append(v, xNode)
          if (data.type === 1) this.handleNodeClick(v)
        })
        .catch((error: any) => {
          console.log(error)
          ;(this as any).$message.error('错误')
        })
    }
  }
  //删除树节点
  removeNode(data: TreeList) {
    deleteFile(data.src)
      .then(() => {
        const xNode = (this.$refs.tree as any).getNode(data.key)
        ;(this.$refs.tree as any).remove(xNode)
        this.$emit('leftBrotherEvents', {
          name: 'clearFiles',
          value: {
            key: data.key,
            k: 3
          }
        })
      })
      .catch((error: any) => {
        console.error(error)
        ;(this as any).$message.error('删除失败')
      })
  }
  //复制或剪裁
  copyOrMove(data: TreeList) {
    this.pasteData = {
      type: data.type,
      src: data.src
    }
  }
  //粘贴
  paste(data: TreeList) {
    if (this.pasteData.src) {
      copyFiles(this.pasteData.type, this.pasteData.src, data.src)
        .then(async () => {
          getDirContent(data.src)
            .then(async (result: TreeList) => {
              ;(this.$refs.tree as any).updateKeyChildren(
                data.key,
                result.children
              )
            })
            .catch((error: any) => {
              console.error(error)
            })
        })
        .catch((error: any) => {
          console.error(error)
          ;(this as any).$message.error('错误')
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
