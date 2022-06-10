<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 10:27:49
 * @LastEditTime: 2022-06-07 21:09:41
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="common-layout">
    <el-container>
      <el-container class="eContainer">
        <el-aside :style="{ width: asideWidth + 'px', overflow: 'hidden' }">
          <LeftComponent ref="leftRef" @leftBrotherEvents="leftBrotherEvents" />
        </el-aside>
        <el-divider direction="vertical" border-style="solid" id="divider" />
        <el-main>
          <RightComponent
            ref="rightRef"
            @rightBrotherEvents="rightBrotherEvents"
          />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
//import HeaderComponent from '@/components/Header.vue'
import LeftComponent from '@/components/Left.vue'
import RightComponent from '@/components/Right.vue'
@Options({
  components: {
    LeftComponent,
    RightComponent
  }
})
export default class HomeComponent extends Vue {
  maxWidth = 400 //最大宽度
  minWidth = 150 //最小宽度
  asideWidth = 200 //当前位置

  mounted() {
    this.$nextTick(() => {
      const divider = document.getElementById('divider') as any
      this.mouseDownAndMove(divider)
    })
  }

  //鼠标按下并移动
  //方式一
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
  //兄弟之间消息中专 左侧兄弟发给右侧
  // eslint-disable-next-line no-undef
  leftBrotherEvents(data: LeftBrotherEvents) {
    ;(this.$refs.rightRef as any).brotherEvents(data)
  }
  // eslint-disable-next-line no-undef
  rightBrotherEvents(data: RightBrotherEvents) {
    ;(this.$refs.leftRef as any).brotherEvents(data)
  }
}
</script>
<style scoped lang="scss">
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
  height: 100vh;
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
