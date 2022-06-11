<!--
 * @Description: 终端 命令行
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-06-11 18:22:21
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="x-app">
    <div class="main-class">
      <!-- 历史命令行 -->
      <div v-for="item in commandArr" :key="item.key">
        <div class="command-action">
          <!-- 执行成功 或 失败图标切换 -->
          <i
            :class="[
              'el-icon-right',
              'command-action-icon',
              { 'error-icon': item.code !== 0 }
            ]"
          ></i>
          <!-- 历史执行地址和命令行、信息 -->
          <span class="command-action-path">{{ item.dirPath }} $</span>
          <span class="command-action-contenteditable">{{ item.command }}</span>
        </div>
        <div class="output-command">{{ item.commandMsg }}</div>
      </div>
      <!-- 当前输入的命令行 -->
      <div
        class="command-action command-action-editor"
        @mouseup="timeoutFocusInput"
      >
        <i class="el-icon-right command-action-icon"></i>
        <!-- 执行地址 -->
        <span class="command-action-path">{{ dirPath }} $</span>
        <!-- 命令行输入 -->
        <span
          :contenteditable="action ? false : true"
          class="command-action-contenteditable"
          @input="onDivInput($event)"
          @keydown="keyFn"
        ></span>
      </div>
      <!-- 当前命令行输出 -->
      <div class="output-command">
        <div v-for="item in commandMsg" :key="item.key">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { spawn } from 'child_process'
import iconvLite from 'iconv-lite'
@Options({
  props: {
    dirPath: String
  },
  watch: {
    dirPath: [
      {
        handler: 'initHandler'
      }
    ]
  }
})
export default class TerminalComponent extends Vue {
  dirPath = '' // 命令行目录
  command = '' // 用户输入命令
  handleCommand = '' // 经过处理的用户命令 比如清除首尾空格、添加获取路径的命令
  commandMsg: any = [] // 当前命令信息
  commandArr: any = [] // 过往命令行输出保存
  isActive = true // 终端是否聚焦
  action = false // 是否正在执行命令
  inputDom: any // 输入框dom
  addPath = '' // 不同系统 获取路径的命令 mac是pwd window是chdir
  mounted() {
    this.addGetPath()
    this.inputDom = document.querySelector('.command-action-contenteditable')
  }
  initHandler(newValue: any, oldValue: any) {
    this.isClear('clear')
  }
  // 回车执行命令
  keyFn(e: any) {
    if (e.keyCode === 13) {
      this.actionCommand()
      e.preventDefault()
    }
  }
  // 执行命令
  actionCommand() {
    const command = this.command.trim()
    this.isClear(command)
    if (this.command === '') return
    this.action = true
    this.handleCommand = this.cdCommand(command)
    const ls = spawn(this.handleCommand, {
      cwd: this.dirPath, // 执行命令路径
      shell: true, // 使用shell命令
      env: process.env
    })
    // 监听命令行执行过程的输出
    ls.stdout.on('data', (data) => {
      const value = data.toString().trim()
      this.commandMsg.push(value)
      console.log(`stdout: ${value}`)
    })
    // 错误或详细状态进度报告 比如 git push、 git clone
    ls.stderr.on('data', (data) => {
      data = iconvLite.decode(data, 'cp936')
      this.commandMsg.push(`stderr: ${data}`)
      console.error(`stderr: ${data}`)
    })
    // 子进程关闭事件 保存信息 更新状态
    ls.on('close', this.closeCommandAction)
  }
  // 执行完毕 保存信息 更新状态
  closeCommandAction(code: any) {
    // 保存执行信息
    this.commandArr.push({
      code, // 是否执行成功
      dirPath: this.dirPath, // 执行路径
      command: this.command, // 执行命令
      commandMsg: this.commandMsg.join('\r') // 执行信息
    })
    // 清空
    this.updatePath(this.handleCommand, code)
    this.commandFinish()
    console.log(
      `子进程退出，退出码 ${code}, 运行${code === 0 ? '成功' : '失败'}`
    )
  }
  // cd命令处理
  cdCommand(command: any) {
    let pathCommand = ''
    if (this.command.startsWith('cd ')) {
      pathCommand = this.addPath
    } else if (this.command.indexOf(' cd ') !== -1) {
      pathCommand = this.addPath
    }
    return command + pathCommand
    // 目录自动联想...等很多细节功能 可以做但没必要2
  }
  // 清空历史
  isClear(command: any) {
    if (command === 'clear') {
      this.commandArr = []
      this.commandFinish()
    }
  }
  // 获取不同系统下的路径
  addGetPath() {
    const systemName = this.getOsInfo()
    if (systemName === 'Mac') {
      this.addPath = ' && pwd'
    } else if (systemName === 'Windows') {
      this.addPath = ' && chdir'
    }
  }
  // 命令执行完毕 重置参数
  commandFinish() {
    this.commandMsg = []
    this.command = ''
    this.inputDom.textContent = ''
    this.action = false
    // 激活编辑器
    this.$nextTick(() => {
      this.focusInput()
      this.scrollBottom()
    })
  }
  // 判断命令是否添加过addPath
  updatePath(command: any, code: any) {
    if (code !== 0) return
    const isPathChange = command.indexOf(this.addPath) !== -1
    if (isPathChange) {
      this.dirPath = this.commandMsg[this.commandMsg.length - 1]
    }
  }
  // 保存输入的命令行
  onDivInput(e: any) {
    this.command = e.target.textContent
  }
  // 点击div
  timeoutFocusInput() {
    setTimeout(() => {
      this.focusInput()
    }, 200)
  }
  // 聚焦输入
  focusInput() {
    this.inputDom.focus() //解决ff不获取焦点无法定位问题
    var range: any = window.getSelection() //创建range
    range.selectAllChildren(this.inputDom) //range 选择obj下所有子内容
    range.collapseToEnd() //光标移至最后
    this.inputDom.focus()
  }
  // 滚动到底部
  scrollBottom() {
    let dom: any = document.querySelector('.x-app')
    dom.scrollTop = dom.scrollHeight // 滚动高度
    dom = null
  }
  // 获取操作系统信息
  getOsInfo() {
    var userAgent = navigator.userAgent.toLowerCase()
    var name = 'Unknown'
    if (userAgent.indexOf('win') > -1) {
      name = 'Windows'
    } else if (userAgent.indexOf('mac') > -1) {
      name = 'Mac'
    } else if (
      userAgent.indexOf('x11') > -1 ||
      userAgent.indexOf('unix') > -1 ||
      userAgent.indexOf('sunname') > -1 ||
      userAgent.indexOf('bsd') > -1
    ) {
      name = 'Unix'
    } else if (userAgent.indexOf('iphone') > -1) {
      name = 'iPhone'
    } else if (userAgent.indexOf('linux') > -1) {
      if (userAgent.indexOf('android') > -1) {
        name = 'Android'
      } else {
        name = 'Linux'
      }
    }
    return name
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.x-app {
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #333;
}
.main-class {
  background: #282c34;
  color: #929292;
  flex: 1;
  padding: 10px 20px 0 10px;
}
.command-action {
  font-size: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.command-action-icon {
  line-height: 16px;
  display: inline-block;
  color: #88e200;
}
.error-icon {
  color: #ff0066;
}
.command-action-path {
  color: #21c5dc;
  margin: 0 5px 0 8px;
  display: inline-block;
}
.command-action-input {
  border: none;
  outline: none;
  color: #b2b2b2;
  background: #282c34;
}
.command-action-contenteditable {
  border: none;
  outline: none;
  background: #282c34;
  min-width: 100px;
  white-space: pre-wrap;
  color: #b2b2b2;
}
.output-command {
  margin: 10px 10px 10px 0;
  white-space: pre-wrap;
}

.command-action-editor {
  padding: 10px 0 20px 0;
}
.x-app::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  height: 3px;
}
.x-app::-webkit-scrollbar-thumb {
  /*滚动条里面小方块样式*/
  background-color: #929292;
}
.x-app::-webkit-scrollbar-track {
  /*滚动条里面轨道样式*/
  background: #282c34;
}
</style>
