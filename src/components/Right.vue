<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:14:09
 * @LastEditTime: 2022-06-07 13:12:05
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
import { getStat } from '@/modular/fsModular'
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
        async (event: any, result: any) => {
          const stat = await getStat(result)
          this.addTab({
            key: `${stat.ino}`,
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
      this.closeFileAll(data.value, data.k) //删掉tab
    } else if (data.name === 'addTab') {
      //打开新tab
      this.addTab(data.value)
    } else if (data.name === 'updateTab') {
      //更新tab
      this.updateTab(data.value)
    }
  }
  updateFileEditState(key: string, state: number) {
    this.tabs.forEach((tab: any) => {
      if (tab.key === key) tab.state = state
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
        this.tabsValue = `${value[0].key}`
        this.updateLocalStorage()
        return false
      }
    }
    this.tabs.push(data)
    this.tabsValue = `${data.key}`
    this.updateLocalStorage()
  }
  //更新tab
  // eslint-disable-next-line no-undef
  updateTab = (data: TreeList) => {
    this.tabs.forEach((tab: any) => {
      if (tab.key === data.key) {
        tab.src = data.src
        tab.label = data.label
        this.updateLocalStorage()
      }
    })
  }
  //关闭+
  removeTab(key: string, k = 3) {
    let state = 0 //是否有未保存的
    if (k === 0) {
      //全部
      const data = this.tabs.filter((value: any) => value.state === 1) //未保存的
      state = data.length
    } else if (k === 1) {
      //其它
      const data = this.tabs.filter(
        (value: any) => value.state === 1 && value.key !== key
      ) //未保存的
      state = data.length
    } else if (k === 3) {
      //自己
      const data = this.tabs.filter(
        (value: any) => value.key === key && value.state === 1
      )
      state = data.length
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
      this.tabsValue = this.tabs[0].key
      this.updateLocalStorage()
    } else if (k === 2) {
      //关闭已保存
      const tabs = this.tabs
      this.tabs = tabs.filter((value: any) => value.state === 1) //未保存的
      if (key === this.tabsValue)
        this.tabsValue = this.tabs.length ? this.tabs[0].key : '0'
      this.updateLocalStorage()
    } else if (k === 3) {
      //关闭当前tab
      const tabs = this.tabs
      this.tabs = tabs.filter((value: any) => value.key !== key)
      if (key === this.tabsValue)
        this.tabsValue = this.tabs.length ? this.tabs[0].key : '0'
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
