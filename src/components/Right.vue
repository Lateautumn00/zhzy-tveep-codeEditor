<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:14:09
 * @LastEditTime: 2022-06-05 15:43:05
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <el-tabs
    v-model="tabsValue"
    type="card"
    class="demo-tabs"
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.key"
      :label="item.label"
      :name="item.key"
      :closable="!item.state"
    >
      <template #label>
        <el-tooltip class="box-item" effect="light" :content="item.src">
          <DropdownComponent
            trigger="contextmenu"
            :type="2"
            placement="bottom"
            size="large"
            :data="item"
            @saveFile="saveFile"
            @removeTab="removeTab"
          >
            <span class="custom-tabs-label">
              <span>{{ item.label }}</span>
              <el-icon v-if="item.state === 1"><Edit /></el-icon>
            </span>
          </DropdownComponent>
        </el-tooltip>
      </template>
      <CodemirrorComponent
        :data="item"
        :ref="'code' + item.key"
        @updateFileEditState="updateFileEditState"
        @closeFileAll="closeFileAll"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import CodemirrorComponent from '@/components/Codemirror.vue'
import DropdownComponent from '@/components/Dropdown.vue'
import path from 'path'
import { ElMessageBox } from 'element-plus'
@Options({
  components: {
    CodemirrorComponent,
    DropdownComponent
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
        this.$emit('rightBrotherEvents', { name: 'updateTab', value: data }) //回传给左侧树
        this.tabs = data.tabs
        this.tabsValue = data.tabsValue
      }
      //监听ipc消息
      //保存功能
      ;(window as any).$electron.ipcRenderer.on('menuPreservation', () => {
        this.saveFile(this.tabsValue) //当前打开并展示的tab
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
  saveFile(tabsValue: string) {
    ;(this.$refs[`code${tabsValue}`] as any)[0].getFileDoc()
  }

  //其他兄弟节点发来的消息
  brotherEvents(data: any) {
    if (data.name === 'clearFiles') {
      this.closeFileAll(data.value, data.k) //清空所有一打开文件
    } else if (data.name === 'addTab') {
      //打开新文件
      this.addTab(data.value)
    }
  }
  updateFileEditState(src: string, state: number) {
    this.tabs.forEach((tab: any) => {
      if (tab.src === src) tab.state = state
    })
    this.updateLocalStorage()
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

  //关闭+
  removeTab(key: string, k = 3) {
    let state = 0 //是否有未保存的
    if (k === 0) {
      const data = this.tabs.filter((value: any) => value.state === 1) //未保存的
      state = data.length
    } else if (k === 1) {
      const data = this.tabs.filter(
        (value: any) => value.state === 1 && value.key !== key
      ) //未保存的
      state = data.length
    } else if (k === 3) {
      const data = this.tabs[Number(key) - 1]
      state = data.state
    }
    if (state === 0) {
      this.closeFileAll(key, k)
    } else if (state > 0) {
      ElMessageBox.confirm('当前编辑内容还未保存，确定关闭？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.closeFileAll(key, k)
        })
        .catch(() => {
          // catch error
        })
    }
  }
  //关闭文件
  /**
   * k 0 关闭全部 1 关闭其它 2关闭已保存 3 关闭当前
   * key 当前的key
   */
  closeFileAll(key: string, k: number) {
    if (k === 0) {
      // 关闭全部已打开文件
      this.tabs = []
      this.tabsValue = '0'
      ;(window as any).localStorage.removeItem(this.openStorageName)
      this.$emit('rightBrotherEvents', { name: 'clearFiles', k }) //回传给左侧树
    } else if (k === 1) {
      //关闭其它
      this.tabs = this.tabs.filter((value: any) => value.key === key)
      this.tabsValue = '1'
      this.tabs[0].key = '1'
      this.updateLocalStorage()
    } else if (k === 2) {
      //关闭已保存
      this.tabs = this.tabs.filter((value: any) => value.state === 1) //未保存的
      this.tabs.forEach((value: any, index: string) => {
        const newKey = `${Number(index)}+1`
        if (value.key === this.tabsValue) this.tabsValue = newKey
        value.key = newKey
      })
      const len = `${this.tabs.length}`
      if (this.tabsValue > len) this.tabsValue = len
      this.updateLocalStorage()
    } else if (k === 3) {
      //关闭当前tab
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
      name: 'updateTab',
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
