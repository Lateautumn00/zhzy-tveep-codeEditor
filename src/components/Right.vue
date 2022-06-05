<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:14:09
 * @LastEditTime: 2022-06-05 12:07:16
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <el-tabs
    v-model="tabsValue"
    type="card"
    class="demo-tabs"
    closable
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.key"
      :label="item.label"
      :name="item.key"
    >
      <template #label>
        <el-tooltip
          class="box-item"
          effect="light"
          :content="item.src"
          placement="bottom"
        >
          <span class="custom-tabs-label">
            <span>{{ item.label }}</span>
            <el-icon v-if="item.state === 1"><Edit /></el-icon>
          </span>
        </el-tooltip>
      </template>
      <CodemirrorComponent
        :src="item.src"
        :ref="'code' + item.key"
        @updateFileEditState="updateFileEditState"
        @clearTab="clearTab"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import CodemirrorComponent from '@/components/Codemirror.vue'
import path from 'path'
import { ElMessageBox } from 'element-plus'
@Options({
  components: {
    CodemirrorComponent
  }
})
export default class RightComponent extends Vue {
  tabsValue = '0' //当前展示的标签
  // eslint-disable-next-line no-undef
  tabs: any = []
  openStorageName = 'fileList'
  mounted() {
    this.$nextTick(() => {
      const dirLocal = (window as any).localStorage.getItem(
        this.openStorageName
      )
      if (dirLocal) {
        const data = JSON.parse(dirLocal)
        this.$emit('rightBrotherEvents', { name: 'addTab', value: data }) //回传给左侧树
        this.tabs = data.tabs
        this.tabsValue = data.tabsValue
      }
      //监听ipc消息
      //保存功能
      ;(window as any).$electron.ipcRenderer.on('menuPreservation', () => {
        this.saveFile()
      })
      //打开文件
      ;(window as any).$electron.ipcRenderer.on(
        'menuOpenFile',
        (event: any, result: any) => {
          this.addTab({
            label: path.basename(result),
            src: result,
            type: 1,
            state: 0,
            children: []
          })
        }
      )
    })
  }
  //保存文件
  saveFile() {
    ;(this.$refs[`code${this.tabsValue}`] as any)[0].getFileDoc()
  }
  //其他兄弟节点发来的消息
  brotherEvents(data: any) {
    if (data.name === 'clearFiles') {
      //清空所有一打开文件
      this.tabs = []
      this.tabsValue = '0'
      ;(window as any).localStorage.removeItem(this.openStorageName)
      this.$emit('rightBrotherEvents', { name: 'clearFiles' }) //回传给左侧树
    } else if (data.name === 'addTab') {
      //打开新文件
      this.addTab(data.value)
    }
  }
  updateFileEditState(src: string, state: number) {
    this.tabs.forEach((tab: any) => {
      if (tab.src === src) tab.state = state
    })
    // this.updateLocalStorage()
  }
  //新增tab
  // eslint-disable-next-line no-undef
  addTab = (data: TreeList) => {
    //判断文件是否已经打开
    if (data) {
      const value = this.tabs.filter((tab: any) => tab.src === data.src)
      if (value.length) {
        this.tabsValue = value[0].key
        this.updateLocalStorage()
        return false
      }
    }
    const newTabName = `${this.tabs.length + 1}`
    //const newTabName = `${Number(this.tabsValue) + 1}`
    this.tabs.push({
      label: data.label,
      key: newTabName,
      src: data.src,
      type: data.type,
      state: data.state,
      children: data.children
    })
    this.tabsValue = newTabName
    this.updateLocalStorage()
  }
  //读取文件内容不存在路径 删除tab
  // eslint-disable-next-line no-unused-vars
  clearTab = (src: string, error: any) => {
    ;(this as any).$message.error(error)
    const value = this.tabs.filter((tab: any) => tab.src === src)
    this.removeTabOk(value[0].key)
  }
  //删除tab
  removeTab = (key: string) => {
    const v = this.tabs[Number(key) - 1]
    if (v.state === 0) {
      this.removeTabOk(key)
    } else if (v.state === 1) {
      ElMessageBox.confirm('当前编辑内容还未保存，确定关闭？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.removeTabOk(key)
        })
        .catch(() => {
          // catch error
        })
    }
  }
  //确认删除
  removeTabOk(key: string) {
    this.tabs.splice(Number(key) - 1, 1)
    this.tabs.forEach((value: any) => {
      if (value.key > key) {
        const newKey = `${Number(value.key) - 1}`
        if (value.key === this.tabsValue) {
          this.tabsValue = newKey
        }
        value.key = newKey
      }
    })
    const len = `${this.tabs.length}`
    if (this.tabsValue > len) this.tabsValue = len
    this.updateLocalStorage()
  }
  //点击tab
  clickTab = () => {
    this.updateLocalStorage()
  }
  //更新缓存
  updateLocalStorage = () => {
    const data = {
      tabsValue: this.tabsValue,
      tabs: this.tabs
    }
    ;(window as any).localStorage.setItem(
      this.openStorageName,
      JSON.stringify(data)
    )
    this.$emit('rightBrotherEvents', {
      name: 'addTab',
      value: data
    }) //回传给左侧树
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.demo-tabs {
  height: 100%;
}
:deep(.el-tabs__header) {
  margin: 0;
}
:deep(.el-tabs__content) {
  height: calc(100% - 41px);
}
.el-tab-pane {
  height: 100%;
}
</style>
