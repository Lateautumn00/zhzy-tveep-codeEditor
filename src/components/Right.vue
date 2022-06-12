<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:14:09
 * @LastEditTime: 2022-06-12 16:59:27
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div
    class="divTop"
    :style="{
      height: 'calc(100% - ' + asideHeight + 'px)',
      overflow: 'hidden'
    }"
  >
    <el-tabs
      v-model="tabsValues"
      type="card"
      class="demo-tabs"
      @tab-remove="closeTab"
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
              @closeTab="closeTab"
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
  </div>
  <el-divider border-style="solid" id="divider1" />
  <div :style="{ height: asideHeight + 'px', overflow: 'hidden' }">
    <TerminalComponent :dirPath="dirPath" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import CodemirrorComponent from '@/components/Codemirror.vue'
import DropdownComponent from '@/components/Dropdown.vue'
import TerminalComponent from '@/components/Terminal.vue'
import { TreeList } from '@/types/tree'
@Options({
  components: {
    CodemirrorComponent,
    DropdownComponent,
    TerminalComponent
  },
  props: {
    tabs: Object,
    tabValue: String,
    dirPath: String
  },
  watch: {
    tabValue: [
      {
        handler: 'tabsValueWatch'
      }
    ]
  },
  emits: { rightBrotherEvents: null }
})
export default class RightComponent extends Vue {
  maxHeight = 500 //最大宽度
  minHeight = 150 //最小宽度
  asideHeight = 300 //当前位置
  dirPath = ''
  tabsValues = '0' //当前展示的标签
  tabs: TreeList[] = []
  //鼠标按下并移动
  mouseDownAndMove = (dom: any) => {
    dom.onmousedown = (e: any) => {
      e = e || window.event
      e.preventDefault() //阻止默认操作
      document.onmousemove = this.mouseMove
      document.onmouseup = this.mouseUp
    }
  }

  //鼠标移动
  mouseMove = (e: any) => {
    e = e || window.event
    let w = this.asideHeight - e.movementY //左侧栏宽度
    if (w < this.minHeight) {
      console.error('高度超下限')
      w = this.minHeight
    } else if (w > this.maxHeight) {
      console.error('高度超上限')
      w = this.maxHeight
    }
    this.asideHeight = w
  }
  //鼠标抬起
  mouseUp = () => {
    document.onmousemove = null
    document.onmouseup = null
  }

  mounted() {
    this.$nextTick(() => {
      //拖动命令行
      const divider = document.getElementById('divider1') as any
      this.mouseDownAndMove(divider)
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
  closeTab(key: string, k = 3) {
    this.$emit('rightBrotherEvents', {
      name: 'closeTab',
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
.el-divider--horizontal {
  margin: 0;
  height: auto;
  border-top: 1px #dcdfe6 solid;
  border-bottom: 1px #dcdfe6 solid;
  cursor: n-resize;
}
</style>
