<!--
 * @Description: 终端 命令行
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-06-16 15:15:50
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="terminal-app">
    <div class="terminal-class">
      <!-- 历史命令行 -->
      <div v-for="item in commandArr" :key="item.key">
        <div class="terminal-action">
          <!-- 执行成功 或 失败图标切换 -->
          <el-icon v-if="item.code"><CircleClose color="red" /></el-icon>
          <el-icon v-else><CircleCheck color="green" /></el-icon>
          <!-- 历史执行地址和命令行、信息 -->
          <span class="terminal-action-path">{{ item.dirPath }} $</span>
          <span
            class="terminal-action-contenteditable terminal-action-contenteditable-error"
            v-if="item.code"
            >{{ item.command }}</span
          >
          <span class="terminal-action-contenteditable" v-else>{{
            item.command
          }}</span>
        </div>
        <div class="terminal-command terminal-command-error" v-if="item.code">
          {{ item.commandMsg }}
        </div>
        <div class="terminal-command" v-else>{{ item.commandMsg }}</div>
      </div>
      <!-- 当前输入的命令行 -->
      <div
        class="terminal-action terminal-action-editor"
        @mouseup="timeoutFocusInput"
      >
        <el-icon><Position color="green" /></el-icon>
        <!-- 执行地址 -->
        <span class="terminal-action-path">{{ dirPath }} $</span>
        <!-- 命令行输入 -->
        <span
          :contenteditable="action ? false : true"
          class="terminal-action-contenteditable"
          @input="onDivInput($event)"
          @keydown="keyFn"
        ></span>
      </div>
      <!-- 当前命令行输出 -->
      <div class="terminal-command">
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
  commandArr: any = [] // 过往命令输出
  isActive = true // 终端是否聚焦
  action = false // 是否正在执行命令
  inputDom: any // 输入框dom
  path = '' // 不同系统 获取路径的命令 mac是pwd window是chdir
  mounted() {
    this.addGetPath()
    this.inputDom = document.querySelector('.terminal-action-contenteditable')
  }
  //切换文件夹 清空历史
  initHandler() {
    this.isClear('clear')
  }
  // 回车执行命令
  keyFn(e: any) {
    if (e.keyCode === 13) {
      this.actionCommand()
      e.preventDefault() //阻止
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
    // 监听命令行执行输出
    ls.stdout.on('data', (data) => {
      data = iconvLite.decode(data, 'cp936')
      const value = data.toString().trim()
      this.commandMsg.push(value)
      console.log(`stdout: ${value}`)
    })
    // 监听错误
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
    this.commandArr.push({
      key: this.commandArr.length,
      code, // 是否执行成功
      dirPath: this.dirPath, // 路径
      command: this.command, // 命令
      commandMsg: this.commandMsg.join('\r') // 返回信息
    }) // 保存执行信息
    // 清空
    this.updatePath(this.handleCommand, code)
    this.commandFinish()
    console.log(`退出码 ${code}, ${code === 0 ? '成功' : '失败'}`)
  }
  // cd命令处理
  cdCommand(command: any) {
    let pathCommand = ''
    if (this.command.startsWith('cd ')) {
      pathCommand = this.path
    } else if (this.command.indexOf(' cd ') !== -1) {
      pathCommand = this.path
    }
    return command + pathCommand
  }

  // 获取不同系统下的路径
  addGetPath() {
    const systemName = this.getOsName()
    if (systemName === 'Mac') {
      this.path = ' && pwd'
    } else if (systemName === 'Windows') {
      this.path = ' && chdir'
    }
  }
  // 清空历史
  isClear(command: any) {
    if (command === 'clear') {
      this.commandArr = []
      this.commandFinish()
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
  // 判断命令是否添加过path
  updatePath(command: any, code: any) {
    if (code !== 0) return
    const isPathChange = command.indexOf(this.path) !== -1
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
    }, 150)
  }
  // 聚焦输入
  focusInput() {
    this.inputDom.focus() //解决ff不获取焦点无法定位问题
    let range: any = window.getSelection() //创建range
    range.selectAllChildren(this.inputDom) //range 选择obj下所有子内容
    range.collapseToEnd() //光标移至最后
    this.inputDom.focus()
  }
  // 滚动到底部
  scrollBottom() {
    let dom: any = document.querySelector('.terminal-app')
    dom.scrollTop = dom.scrollHeight // 滚动高度
    dom = null
  }
  // 获取操作系统
  getOsName() {
    const userAgent = navigator.userAgent.toLowerCase()
    let systemName = ''
    if (userAgent.indexOf('win') > -1) {
      systemName = 'Windows'
    } else if (userAgent.indexOf('mac') > -1) {
      systemName = 'Mac'
    } else if (
      userAgent.indexOf('x11') > -1 ||
      userAgent.indexOf('unix') > -1 ||
      userAgent.indexOf('sunname') > -1 ||
      userAgent.indexOf('bsd') > -1
    ) {
      systemName = 'Unix'
    } else if (userAgent.indexOf('iphone') > -1) {
      systemName = 'iPhone'
    } else if (userAgent.indexOf('linux') > -1) {
      if (userAgent.indexOf('android') > -1) {
        systemName = 'Android'
      } else {
        systemName = 'Linux'
      }
    }
    return systemName
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use '@/assets/style/default.scss';
@use '@/assets/style/mixin.scss' as mixin;
$terminal-error-color: red;
$terminal-color: #333;
$terminal-path-color: #21c5dc;
.terminal-app {
  @include mixin.set-overflow(false, false, 100%);
  @include mixin.set-flex(center, null, column);
  color: $terminal-color;
}
.terminal-class {
  flex: 1;
  padding: 10px 20px 0 10px;
}
.terminal-action-contenteditable {
  border: none;
  outline: none;
  min-width: 100px;
  white-space: pre-wrap;
}
.terminal-action-contenteditable-error {
  color: $terminal-error-color;
}
.terminal-action {
  @include mixin.set-flex(null, center, null, wrap);
}
.terminal-action-path {
  color: $terminal-path-color;
  margin: 0 5px 0 8px;
  display: inline-block;
}

.terminal-command {
  margin: 5px;
  white-space: pre-wrap;
}
.terminal-command-error {
  color: $terminal-error-color;
}

.terminal-action-editor {
  padding: 10px 0 20px 0;
}
.terminal-app::-webkit-scrollbar {
  /*滚动条整体样式*/
  @include mixin.widthOrHeight(1px, 1px);
}
</style>
