<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:14:09
 * @LastEditTime: 2022-05-31 11:13:18
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
      <CodemirrorComponent :src="item.src" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import CodemirrorComponent from '@/components/Codemirror.vue'

@Options({
  components: {
    CodemirrorComponent
  }
})
export default class RightComponent extends Vue {
  tabsValue = '' //当前展示的标签
  // eslint-disable-next-line no-undef
  tabs: any = []
  localStorageName = 'fileList'
  mounted() {
    this.$nextTick(() => {
      const dirLocal = (window as any).localStorage.getItem(
        this.localStorageName
      )
      if (dirLocal) {
        const data = JSON.parse(dirLocal)
        this.tabs = data.tabs
        this.tabsValue = data.tabsValue
      }
    })
  }
  //切换文件夹，清空已打开的文件
  clearFiles() {
    this.tabs = []
    ;(window as any).localStorage.removeItem(this.localStorageName)
  }
  //新增tab
  // eslint-disable-next-line no-undef
  addTab = (data?: TreeList) => {
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
    this.tabs.push({
      label: data ? data.label : 'New Tab',
      key: newTabName,
      src: data ? data.src : ''
    })
    this.tabsValue = newTabName
    this.updateLocalStorage()
  }
  //删除tab
  removeTab = (targetName: string) => {
    const tabs = this.tabs
    let activeName = this.tabsValue
    if (activeName === targetName) {
      tabs.forEach((tab: any, index: any) => {
        if (tab.key === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.key
          }
        }
      })
    }
    this.tabsValue = activeName
    this.tabs = tabs.filter((tab: any) => tab.key !== targetName)
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
      this.localStorageName,
      JSON.stringify(data)
    )
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
