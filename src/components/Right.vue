<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:14:09
 * @LastEditTime: 2022-06-08 12:24:10
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <el-tabs
    v-model="tabsValues"
    type="card"
    class="demo-tabs"
    @tab-remove="removeTab"
    @tab-click="clickTabs"
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
            :dataList="item"
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
        :dataList="item"
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
import { TreeList } from '@/types/tree'
@Options({
  components: {
    CodemirrorComponent,
    DropdownComponent
  },
  props: {
    tabs: Object,
    tabValue: String
  },
  watch: {
    tabValue: [
      {
        handler: 'tabsValueWatch'
      }
    ]
  }
})
export default class RightComponent extends Vue {
  tabsValues = '0' //当前展示的标签
  tabs: TreeList[] = []
  mounted() {
    this.$nextTick(() => {
      //保存功能
      ;(window as any).$electron.ipcRenderer.on('menuPreservation', () => {
        this.saveFile(this.tabsValues) //当前打开并展示的tab
      })
    })
  }
  tabsValueWatch(newValue: any, oldValue: any) {
    if (newValue !== oldValue) this.tabsValues = newValue
  }
  //保存文件
  saveFile(tabsValue: string) {
    ;(this.$refs[`code${tabsValue}`] as any)[0].getFileDoc()
  }
  updateFileEditState(key: string, state: number) {
    this.$emit('rightBrotherEvents', {
      name: 'updateFileEditState',
      value: {
        key,
        state
      }
    })
  }
  //关闭+
  removeTab(key: string, k = 3) {
    this.$emit('rightBrotherEvents', {
      name: 'removeTab',
      value: {
        key,
        k
      }
    })
  }
  closeFileAll(key: string, k: number) {
    this.$emit('rightBrotherEvents', {
      name: 'closeFileAll',
      value: {
        key,
        k
      }
    })
  }
  //点击切换tab
  clickTabs(p: any) {
    this.$emit('rightBrotherEvents', {
      name: 'clickTab',
      value: {
        key: p.props.name
      }
    })
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
