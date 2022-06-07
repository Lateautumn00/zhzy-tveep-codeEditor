<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:02:45
 * @LastEditTime: 2022-06-06 19:36:18
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="left">
    <el-tree
      ref="tree"
      :data="data"
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
          :data="data"
          @handleNodeClick="handleNodeClick"
          @createDialog="createDialog"
          @removeNode="removeNode"
        >
          <span class="custom-tree-node">
            <el-icon v-if="data.state === 1"><Edit /></el-icon>
            <span>{{ data.label }}</span>
          </span>
        </DropdownComponent>
      </template>
    </el-tree>
    <DialogComponent ref="dialog" @createFile="createFile" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DropdownComponent from '@/components/Dropdown.vue'
import {
  getDirContent,
  deleteFile,
  createFilePath,
  renameFile,
  getStat
} from '@/modular/fsModular'
import DialogComponent from '@/components/Dialog.vue'
interface DialogData {
  title: string
  type: number
  src: string
  name: string
}
@Options({
  components: {
    DropdownComponent,
    DialogComponent
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
  // eslint-disable-next-line no-undef
  data: any = [
    {
      key: '-2',
      label: '已打开文件',
      src: '',
      type: -2,
      state: 0,
      children: []
    }
  ]
  dirLocal = '' //本地缓存文件夹地址
  localStorageName = 'menuOpenDirectory' //目录地址缓存
  openStorageName = 'fileList' //一打开文件
  xNode: any //当前操作的
  mounted() {
    this.$nextTick(() => {
      const dirLocal = (window as any).localStorage.getItem(
        this.localStorageName
      )
      if (dirLocal) {
        getDirContent(dirLocal)
          .then((res: any) => {
            res.type = -1
            this.data[1] = res
            this.dirLocal = dirLocal
          })
          .catch((error: any) => {
            ;(window as any).localStorage.removeItem(this.localStorageName)
            console.error(error)
          })
      }

      //监听ipc消息
      ;(window as any).$electron.ipcRenderer.on(
        'menuOpenDirectory',
        (event: any, result: any) => {
          getDirContent(result)
            .then((res: any) => {
              res.type = -1
              this.data[1] = res
              this.dirLocal = result
              ;(window as any).localStorage.setItem(
                this.localStorageName,
                result
              ) //将本次的文件夹目录写入缓存
              this.$emit('leftBrotherEvents', {
                name: 'clearFiles',
                k: 0,
                value: ''
              })
            })
            .catch((error: any) => {
              ;(this as any).$message.error(error)
              console.error(error)
            })
        }
      )
    })
  }
  //其他兄弟节点发来的消息
  brotherEvents(data: any) {
    if (data.name === 'clearFiles') {
      //清空所有一打开文件
      if (data.k === 1) this.data[0].children = []
    } else if (data.name === 'updateTab') {
      //打开新文件
      this.data[0].children = data.value.tabs
    }
  }

  // eslint-disable-next-line no-undef
  handleNodeClick = (value: TreeList) => {
    if (value.type === 1) {
      //去读取文件
      this.$emit('leftBrotherEvents', { name: 'addTab', value: value })
    }
  }
  //创建文件
  // eslint-disable-next-line no-undef
  createDialog(type: number, node: any) {
    this.xNode = node
    const title = type === 1 ? '创建文件' : type === 0 ? '创建文件夹' : '重命名'
    const name = type === 2 || type === 3 ? node.data.label : ''
    ;(this.$refs.dialog as any).openDialog({
      title,
      type: type,
      src: node.data.src,
      name
    })
  }
  //创建
  createFile(data: DialogData) {
    if (data.type === 2 || data.type === 3) {
      //重命名
      renameFile(data.src, data.name)
        .then(async (res: any) => {
          const stat = await getStat(res)
          ;(this.$refs.tree as any).updateKeyChildren(this.xNode, {
            key: `${stat.ino}`,
            label: data.name,
            src: res,
            type: 1,
            state: 0,
            children: []
          })
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
          ;(this.$refs.tree as any).append(v, this.xNode)
          if (data.type === 1) this.handleNodeClick(v)
        })
        .catch((error: any) => {
          console.log(error)
          ;(this as any).$message.error('错误')
        })
    }
  }
  removeNode(node: any) {
    deleteFile(node.data.src)
      .then(() => {
        ;(this.$refs.tree as any).remove(node)
        this.$emit('leftBrotherEvents', {
          name: 'clearFiles',
          k: 3,
          value: node.data.key
        })
      })
      .catch((error: any) => {
        console.error(error)
        ;(this as any).$message.error('删除失败')
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
