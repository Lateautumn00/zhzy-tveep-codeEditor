<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:02:45
 * @LastEditTime: 2022-06-17 16:29:18
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="left">
    <div class="title"><span>已打开文件</span></div>
    <el-tree
      :data="openData"
      :props="defaultProps"
      highlight-current
      @node-click="handleNodeClick"
      node-key="key"
    >
      <template #default="{ data }">
        <DropdownComponent
          trigger="contextmenu"
          :index="data.index"
          placement="bottom"
          size="large"
          :dataList="data"
          :pasteData="pasteData"
          @handleNodeClick="handleNodeClick"
          @removeNode="removeNode"
          @copyOrMove="copyOrMove"
        >
          <span class="custom-tree-node">
            <el-icon v-if="data.state === 1 && data.isLeaf"><Edit /></el-icon>
            <el-icon
              @click.stop="closeTab(data)"
              v-if="data.state === 0 && data.isLeaf"
              ><Close
            /></el-icon>
            <span>{{ data.label }}</span>
          </span>
        </DropdownComponent>
      </template>
    </el-tree>
    <div>
      <DropdownComponent
        trigger="contextmenu"
        :index="2"
        placement="bottom"
        size="large"
        :dataList="titleData"
        :pasteData="pasteData"
        @handleNodeClick="handleNodeClick"
        @createDialog="createDialog"
        @copyOrMove="copyOrMove"
        @paste="paste"
      >
        <div class="title">
          <span>{{ titleData.label }}</span>
          <div class="title-icon">
            <el-tooltip class="box-item" effect="light" content="刷新">
              <el-icon :size="16" @click="updateDir"><RefreshRight /></el-icon>
            </el-tooltip>
            <el-tooltip class="box-item" effect="light" content="新建文件">
              <el-icon :size="16" @click="createDialog('create', true)"
                ><DocumentAdd
              /></el-icon>
            </el-tooltip>
            <el-tooltip class="box-item" effect="light" content="新建文件夹">
              <el-icon :size="16" @click="createDialog('create', false)"
                ><FolderAdd /></el-icon
            ></el-tooltip>
          </div>
        </div>
      </DropdownComponent>
    </div>
    <el-tree
      ref="tree"
      :data="dataList"
      :props="defaultProps"
      highlight-current
      @node-click="handleNodeClick"
      node-key="key"
      :check-on-click-node="true"
      :lazy="true"
      :load="loadNode"
      draggable
      @node-drop="nodeDrop"
      :allow-drop="allowDrop"
    >
      <template #default="{ data }">
        <DropdownComponent
          trigger="contextmenu"
          :index="data.index"
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
  getDirContentOne,
  deleteFile,
  createFilePath,
  renameFile,
  copyFiles,
  moveFile
} from '@/modular/fsModular'
import DialogComponent from '@/components/Dialog.vue'
import { TreeList } from '@/types/tree'
import path from 'path'
@Options({
  components: {
    DropdownComponent,
    DialogComponent
  },
  props: {
    openData: Object,
    tabValue: String
  },
  watch: {
    tabValue: [
      {
        handler: 'tabsValueWatch'
      }
    ]
  },
  emits: {
    leftBrotherEvents: null
  }
})
export default class LeftComponent extends Vue {
  defaultProps = {
    index: 'index',
    key: 'ino',
    label: 'label',
    src: 'src',
    children: 'children',
    isLeaf: 'isLeaf',
    state: 'state' //状态 0 未有修改 1 有修改 1
  }
  //tabsValue = '0'
  openData: TreeList[] = []
  dataList: TreeList[] = []
  titleData: TreeList = {
    index: 2,
    key: '-1',
    label: '',
    src: '',
    children: [],
    isLeaf: false,
    state: 0 //状态 0 未有修改 1 有修改 1
  } //文件夹
  localStorageName = 'menuOpenDirectory' //目录地址缓存名称
  pasteData = {
    mode: '',
    type: false, //true复制文件 false复制文件夹
    src: '',
    key: ''
  } //是否可粘贴
  xNodeKey = '' //当前操作的
  tabsValueWatch(newValue: any, oldValue: any) {
    if (oldValue === '0') return false
    if (newValue === oldValue) return false
    const xNode = (this.$refs.tree as any).getNode(newValue)
    if (xNode) {
      ;(this.$refs.tree as any).setCurrentNode(xNode, true)
    }
  }
  mounted() {
    this.$nextTick(() => {
      //打开新文件夹
      ;(window as any).$electron.ipcRenderer.on(
        'menuOpenDirectory',
        (event: any, result: string) => {
          getDirContentOne(result)
            .then((res: TreeList) => {
              this.updateTitleData(res)
              this.dataList = res.children
              ;(window as any).localStorage.setItem(
                this.localStorageName,
                result
              ) //将本次的文件夹目录写入缓存
              this.$emit('leftBrotherEvents', {
                name: 'closeFileAll',
                value: {
                  key: '',
                  k: 0
                }
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
  allowDrop(node: any, lastNode: any, position: string) {
    //console.log(node, lastNode, position)
    if (lastNode.data.isLeaf) {
      if (position === 'inner') {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }
  //拖动节点成功
  nodeDrop(node: any, lastNode: any, position: string) {
    //console.log('拖动成功', node, lastNode, position, e)
    const source = node.data.src //源文件
    let target = lastNode.data.src //目标文件
    let targetKey = lastNode.parent.key || lastNode.parent.id //目标key
    if (lastNode.data.isLeaf) {
      //如果目标是文件
      target = path.dirname(target)
    } else {
      //目标是文件夹
      if (position !== 'inner') {
        target = path.dirname(target)
      }
    }
    //console.log('结果', source, target, targetKey)
    if (path.join(target, path.basename(source)) === source) return false //如果新文件与源文件路径相同 就返回
    moveFile(node.data.isLeaf, source, target)
      .then(async (v: any) => {
        const xNodeReMove = (this.$refs.tree as any).getNode(node.data.key)
        ;(this.$refs.tree as any).remove(xNodeReMove)
        const xNodeAppend = (this.$refs.tree as any).getNode(targetKey)
        ;(this.$refs.tree as any).append(v, xNodeAppend)
        this.$emit('leftBrotherEvents', {
          name: 'updateTab',
          value: {
            xNode: v,
            type: node.data.isLeaf,
            oldSrc: source
          }
        }) //通知right
      })
      .catch((error: any) => {
        console.error(error)
        //;(this as any).$message.error('错误')
      })
  }
  //刷新文件目录
  updateDir() {
    getDirContentOne(this.titleData.src)
      .then((res: TreeList) => {
        this.updateTitleData(res)
        this.dataList = res.children
      })
      .catch((error: any) => {
        ;(this as any).$message.error(error)
        console.error(error)
      })
  }
  //更新文件夹
  updateTitleData(data: TreeList) {
    this.titleData = {
      index: 2,
      key: data.key,
      label: data.label.toUpperCase(),
      src: data.src,
      children: [],
      isLeaf: data.isLeaf,
      state: data.state //状态 0 未有修改 1 有修改 1
    }
    this.$emit('leftBrotherEvents', {
      name: 'updateDirPath',
      value: data.src
    })
  }
  //异步加载文件夹子树
  loadNode = async (node: any, resolve: any) => {
    let src = ''
    if (node.level === 0) {
      src = (window as any).localStorage.getItem(this.localStorageName)
    } else if (node.level > 0) {
      src = node.data.src
    }
    if (src === '') return false
    getDirContentOne(src)
      .then((data: TreeList) => {
        if (node.level === 0) this.updateTitleData(data)
        return resolve(data.children)
      })
      .catch((error: any) => {
        ;(this as any).$message.error(error)
        console.error(error)
      })
  }
  //打开文件
  handleNodeClick = (value: TreeList) => {
    if (value.isLeaf) {
      //去读取文件
      this.$emit('leftBrotherEvents', { name: 'addTab', value: value })
    }
  }
  //创建文件
  createDialog(tag: string, type: boolean, data?: TreeList) {
    data = data || this.titleData
    this.xNodeKey = `${data.key}`
    let name = ''
    let title = ''
    if (tag === 'create') {
      title = type ? '创建文件' : '创建文件夹'
    } else if (tag === 'basename') {
      title = '重命名'
      name = data.label
    }
    ;(this.$refs.dialog as any).openDialog({
      tag: tag,
      title,
      type: type,
      src: data.src,
      name
    })
  }
  //创建文件 文件夹
  operationFile(data: DialogData) {
    if (data.tag === 'basename') {
      //重命名
      renameFile(data.src, data.name)
        .then((res: any) => {
          const xNode = (this.$refs.tree as any).getNode(this.xNodeKey)
          const oldSrc = xNode.data.src
          xNode.data.label = data.name
          xNode.data.src = res
          if (!data.type) {
            getDirContentOne(res)
              .then((result: TreeList) => {
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
          })
        })
        .catch((error: any) => {
          console.error(error)
          ;(this as any).$message.error('错误')
        })
    } else {
      //创建文件 文件夹
      createFilePath(data.type, data.src, data.name)
        .then((v: any) => {
          const xNode = (this.$refs.tree as any).getNode(this.xNodeKey)
          ;(this.$refs.tree as any).append(v, xNode)
          if (data.type) this.handleNodeClick(v)
        })
        .catch((error: any) => {
          console.error(error)
          ;(this as any).$message.error('错误')
        })
    }
  }
  //关闭tab
  closeTab(data: TreeList) {
    this.$emit('leftBrotherEvents', {
      name: 'closeTab',
      value: {
        key: data.key,
        k: 3
      }
    })
  }
  //删除树节点
  removeNode(data: TreeList) {
    deleteFile(data.src)
      .then((res: string) => {
        const xNode = (this.$refs.tree as any).getNode(data.key)
        ;(this.$refs.tree as any).remove(xNode)
        if (res === 'file') {
          this.$emit('leftBrotherEvents', {
            name: 'closeFileAll',
            value: {
              key: data.key,
              k: 3
            }
          })
        } else {
          this.$emit('leftBrotherEvents', {
            name: 'closeFileAll',
            value: {
              key: data.key,
              k: 4,
              src: data.src
            }
          })
        }
      })
      .catch((error: any) => {
        console.error(error)
        ;(this as any).$message.error('删除失败')
      })
  }
  //复制或剪裁操作
  copyOrMove(mode: string, data: TreeList) {
    this.pasteData = {
      mode: mode,
      type: data.isLeaf,
      src: data.src,
      key: data.key
    }
  }
  //粘贴
  paste(data: TreeList) {
    if (this.pasteData.src) {
      if (this.pasteData.mode === 'copy') {
        this.copy(data)
      } else if (this.pasteData.mode === 'move') {
        this.move(data)
      }
    }
  }
  //复制
  copy(data: TreeList) {
    copyFiles(this.pasteData.type, this.pasteData.src, data.src)
      .then(() => {
        getDirContentOne(data.src)
          .then((result: TreeList) => {
            if (data.index === 2) {
              this.dataList = result.children
            } else {
              ;(this.$refs.tree as any).updateKeyChildren(
                data.key,
                result.children
              )
            }
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
  //剪裁
  move(data: TreeList) {
    moveFile(this.pasteData.type, this.pasteData.src, data.src)
      .then(async (v: any) => {
        const xNodeReMove = (this.$refs.tree as any).getNode(this.pasteData.key)
        ;(this.$refs.tree as any).remove(xNodeReMove)
        const xNodeAppend = (this.$refs.tree as any).getNode(data.key)
        ;(this.$refs.tree as any).append(v, xNodeAppend)
        this.$emit('leftBrotherEvents', {
          name: 'updateTab',
          value: {
            xNode: v,
            type: this.pasteData.type,
            oldSrc: this.pasteData.src
          }
        }) //通知right
        this.pasteData = {
          mode: '',
          type: data.isLeaf,
          src: '',
          key: ''
        }
      })
      .catch((error: any) => {
        console.error(error)
        ;(this as any).$message.error('错误')
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use '@/assets/style/default.scss';
@use '@/assets/style/mixin.scss' as mixin;
.left {
  @include mixin.set-overflow(false, true, 100%);
}
.left::-webkit-scrollbar {
  /*滚动条整体样式*/
  @include mixin.widthOrHeight(1px, 1px);
}
.title {
  background: #ecf5ff;
  @include mixin.widthOrHeight(null, 25px);
  @include mixin.set-flex(space-between, center);
  padding: 0 5px;
  > span {
    font-weight: bold;
    @include mixin.omit-text(70%);
  }
  > .title-icon {
    @include mixin.widthOrHeight(60px);
    @include mixin.set-flex(space-between, center);
    > .el-icon {
      @include mixin.set-cursor(pointer);
    }
  }
}
:deep(.el-dropdown) {
  @include mixin.widthOrHeight(100%);
}
:deep(.el-dropdown--large) {
  @include mixin.widthOrHeight(100%);
}
</style>
