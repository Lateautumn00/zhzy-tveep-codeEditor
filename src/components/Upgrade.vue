<!--手动升级-->
<template>
  <div id="update">
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="showClose"
      center
    >
      <div class="percentages">
        <el-progress
          status="success"
          :text-inside="true"
          :stroke-width="20"
          :percentage="percentage"
          :width="strokeWidth"
          :show-text="true"
        ></el-progress>
      </div>
      <div class="footer" v-if="btnStatus && !isBtn">
        <el-button @click="closeDialog">暂不升级</el-button>
        <el-button @click="upgrade" type="primary">升级</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ipcRenderer } from 'electron'
@Options({
  components: {}
})
export default class UpgradeComponent extends Vue {
  title = ''
  dialogVisible = false
  closeOnClickModal = false
  closeOnPressEscape = false
  showClose = false
  percentage = 0
  strokeWidth = 200
  timeOut = 0
  btnStatus = false //是否显示升级按钮
  isBtn = process.env.VUE_APP_UPGRADE === 'automatic' ? true : false //true 自动升级 false 手动升级
  /**
   * 关闭
   */
  closeDialog() {
    this.title = ''
    this.dialogVisible = false
  }
  /**
   * 开始更新
   */
  upgrade() {
    ipcRenderer.send('downloadUpdate')
    this.btnStatus = false
  }
  mounted() {
    ipcRenderer.send('checkForUpdate') //检查版本更新
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let _this = this
    //接收主进程版本更新消息
    ipcRenderer.on('message', (event: any, arg: any) => {
      _this.title = arg.title
      if ('update-available' === arg.cmd) {
        _this.btnStatus = true
        _this.dialogVisible = true //显示升级对话框
      } else if ('download-progress' === arg.cmd) {
        const percent = Math.round(parseFloat(arg.message.percent))
        _this.percentage = percent
      } else if ('update-downloaded' === arg.cmd) {
        _this.dialogVisible = false
      } else if ('error' === arg.cmd) {
        _this.dialogVisible = false
      }
    })
  }
}
</script>
<style lang="scss">
#update {
  background: #f8f8f8;
}
.percentages {
  width: 100%;
  height: 5vh;
  line-height: 5vh;
  text-align: center;
}
body {
  margin: 0px;
}
.v-modal {
  opacity: 1 !important;
  background: rgba(0, 0, 0, 0.5) !important;
}
.el-tooltip {
  display: flex;
  align-items: center;
}
.footer {
  display: flex;
  flex-flow: row-reverse;
}
</style>
<style lang="scss" scoped>
.tableList {
  widows: 150px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.el-tooltip__popper {
  font-size: 14px;
  max-width: 300px !important;
  text-align: justify;
  text-justify: newspaper;
  word-break: break-all;
  line-height: 20px;
}
</style>
