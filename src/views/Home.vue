<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 10:27:49
 * @LastEditTime: 2022-06-14 15:03:40
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <HeaderComponent />
      </el-header>
      <el-container class="eContainer">
        <el-aside :style="{ width: asideWidth + 'px', overflow: 'hidden' }">
          <LeftComponent
            ref="leftRef"
            @leftBrotherEvents="leftBrotherEvents"
            :openData="openData"
          />
        </el-aside>
        <el-divider direction="vertical" border-style="solid" id="divider" />
        <el-main>
          <RightComponent
            ref="rightRef"
            @rightBrotherEvents="rightBrotherEvents"
            :tabs="openData"
            :tabValue="tabsValue"
            :dirPath="dirPath"
          />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HeaderComponent from '@/components/Header.vue'
import LeftComponent from '@/components/Left.vue'
import RightComponent from '@/components/Right.vue'
import path from 'path'
import { ElMessageBox } from 'element-plus'
import { getStat } from '@/modular/fsModular'
import { TreeList } from '@/types/tree'
import {
  EventsBrother,
  LeftBrotherEvents,
  RightBrotherEvents
} from '@/types/brotherEvents'
@Options({
  components: {
    HeaderComponent,
    LeftComponent,
    RightComponent
  }
})
export default class HomeComponent extends Vue {
  maxWidth = 400 //最大宽度
  minWidth = 150 //最小宽度
  asideWidth = 200 //当前位置
  dirPath = '' //当前文件夹路径
  tabsValue = '0' //当前展示的标签
  openStorageName = 'fileList' //一打开文件缓存名称
  openData: TreeList[] = [] //已打开文件树
  mounted() {
    this.$nextTick(() => {
      //拖动左侧栏
      const divider = document.getElementById('divider') as any
      this.mouseDownAndMove(divider)
      this.openDefaultFile()
      //监听ipc 打开文件
      //打开文件
      ;(window as any).$electron.ipcRenderer.on(
        'menuOpenFile',
        async (event: any, result: string) => {
          const stat = await getStat(result)
          const tab: TreeList = {
            index: 4,
            key: `${stat.ino}`,
            label: path.basename(result),
            src: result,
            isLeaf: true,
            state: 0,
            children: []
          }
          this.addTab(tab)
        }
      )
    })
  }
  //打开上次的文件
  openDefaultFile() {
    //默认打开文件
    const FilesLocal = (window as any).localStorage.getItem(
      this.openStorageName
    )
    if (FilesLocal) {
      const data = JSON.parse(FilesLocal)
      this.openData = data.tabs
      this.tabsValue = data.tabsValue
    }
  }
  //左侧
  leftBrotherEvents(data: LeftBrotherEvents) {
    if (data.name === 'addTab') {
      this.addTab(data.value) //打开新tab
    } else if (data.name === 'updateTab') {
      this.updateTab(data.value) //更新tab
    } else if (data.name === 'closeTab') {
      this.closeTab(data.value.key, data.value.k) //关闭tab 判断弹窗
    } else if (data.name === 'closeFileAll') {
      this.closeFileAll(data.value.key, data.value.k, data.value.src) //删掉tab
    } else if (data.name === 'updateDirPath') {
      this.dirPath = data.value
    }
  }
  //右侧
  rightBrotherEvents(data: RightBrotherEvents) {
    if (data.name === 'clickTab') {
      this.tabsValue = data.value.key
      this.updateLocalStorage() //点击tab
    } else if (data.name === 'updateFileEditState') {
      this.updateFileEditState(data.value.key, data.value.state)
    } else if (data.name === 'closeTab') {
      this.closeTab(data.value.key, data.value.k) //关闭tab 判断弹窗
    } else if (data.name === 'closeFileAll') {
      this.closeFileAll(data.value.key, data.value.k) //关闭tab 不判断弹窗
    }
  }
  //新增tab
  addTab = (data: TreeList) => {
    //判断文件是否已经打开
    if (data) {
      const value = this.openData.filter((tab: any) => tab.src === data.src)
      if (value.length) {
        this.tabsValue = `${value[0].key}`
        this.updateLocalStorage()
        return false
      }
    }
    this.openData.push(data)
    this.tabsValue = `${data.key}`
    this.updateLocalStorage()
  }
  //关闭+
  closeTab(key: string, k = 3) {
    let state = 0 //是否有未保存的
    if (k === 0) {
      //全部
      const data = this.openData.filter((value: any) => value.state === 1) //未保存的
      state = data.length
    } else if (k === 1) {
      //其它
      const data = this.openData.filter(
        (value: any) => value.state === 1 && value.key !== key
      ) //未保存的
      state = data.length
    } else if (k === 3) {
      //自己
      const data = this.openData.filter(
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
  closeFileAll(key: string, k: number, src?: string) {
    if (k === 0) {
      // 关闭全部已打开文件
      this.openData = []
      this.tabsValue = '0'
    } else if (k === 1) {
      //关闭其它
      this.openData = this.openData.filter((value: any) => value.key === key)
      this.tabsValue = this.openData[0].key
    } else if (k === 2) {
      //关闭已保存
      const tabs = this.openData
      this.openData = tabs.filter((value: any) => value.state === 1) //未保存的
      if (key === this.tabsValue)
        this.tabsValue = this.openData.length ? this.openData[0].key : '0'
    } else if (k === 3) {
      //关闭当前tab
      const tabs = this.openData
      this.openData = tabs.filter((value: any) => value.key !== key)
      if (key === this.tabsValue)
        this.tabsValue = this.openData.length ? this.openData[0].key : '0'
    } else if (k === 4) {
      //左侧树删除目录
      const len = src ? src.length : 0
      if (len === 0) return
      this.openData = this.openData.filter(
        (tab: any) => tab.src.substr(0, len) !== src
      )
    }
    this.updateLocalStorage()
  }
  //更新tab
  updateTab = (data: any) => {
    if (data.type) {
      this.openData.forEach((tab: any) => {
        if (tab.key === data.xNode.key) {
          tab.src = data.xNode.src
          tab.label = data.xNode.label
          this.updateLocalStorage()
        }
      })
    } else {
      let num = 0
      const len = data.oldSrc.length
      this.openData.forEach((tab: any) => {
        if (tab.src.substr(0, len) === data.oldSrc) {
          tab.src = data.xNode.src + tab.src.substr(len)
          ++num
        }
      })
      if (num > 0) this.updateLocalStorage()
    }
  }
  //更新编辑状态
  updateFileEditState(key: string, state: number) {
    this.openData.forEach((tab: any) => {
      if (tab.key === key) tab.state = state
    })
    this.updateLocalStorage()
  }
  //更新缓存
  updateLocalStorage = () => {
    const data: EventsBrother = {
      tabsValue: this.tabsValue,
      tabs: this.openData
    }
    ;(window as any).localStorage.setItem(
      this.openStorageName,
      JSON.stringify(data)
    )
  }
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
    let w = this.asideWidth + e.movementX //左侧栏宽度
    if (w < this.minWidth) {
      console.error('宽度超下限')
      w = this.minWidth
    } else if (w > this.maxWidth) {
      console.error('宽度超上限')
      w = this.maxWidth
    }
    this.asideWidth = w
  }
  //鼠标抬起
  mouseUp = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/style/default.scss';
.el-header {
  -webkit-app-region: drag; /**实现拖拽窗口 */
  --el-header-height: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  //justify-content: flex-end;
  border-bottom: 1px #dcdfe6 solid;
}
.eContainer {
  height: calc(100vh - 51px);
}
.el-divider--vertical {
  height: auto;
  border-left: 1px #dcdfe6 solid;
  border-right: 1px #dcdfe6 solid;
  cursor: e-resize;
}
.el-main {
  --el-main-padding: 0;
}
</style>
