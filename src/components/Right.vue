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
    v-model="editableTabsValue"
    type="card"
    class="demo-tabs"
    closable
    addable
    @tab-remove="removeTab"
    @tab-add="addTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.key"
      :label="item.label"
      :name="item.key"
    >
      <CodemirrorComponent />
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
  editableTabsValue = '1' //当前展示的标签
  editableTabs = [
    {
      key: '1',
      label: 'a.js'
    },
    {
      key: '2',
      label: 'b.js'
    },
    {
      key: '3',
      label: 'c.js'
    }
  ]
  //新增tab
  addTab() {
    const newTabName = `${this.editableTabs.length + 1}`
    this.editableTabs.push({
      label: 'New Tab',
      key: newTabName
    })
    this.editableTabsValue = newTabName
  }
  //删除tab
  removeTab(targetName: string) {
    const tabs = this.editableTabs
    let activeName = this.editableTabsValue
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.key === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.key
          }
        }
      })
    }
    this.editableTabsValue = activeName
    this.editableTabs = tabs.filter((tab) => tab.key !== targetName)
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
