<!--
 * @Description: 终端 命令行
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-06-19 19:24:18
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="terminal-app" ref="terminalApp">
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
      <div class="terminal-action terminal-action-editor" @mouseup="focusInput">
        <el-icon><Position color="green" /></el-icon>
        <!-- 执行地址 -->
        <span class="terminal-action-path">{{ newPath }} $</span>
        <!-- 命令行输入 -->
        <span
          :contenteditable="action ? false : true"
          class="terminal-action-contenteditable"
          @input="onDivInput($event)"
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
import path from 'path'
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
  newPath = '' // 命令行目录
  command = '' // 用户输入命令
  handleCommand = '' // 经过处理的用户命令 比如清除首尾空格、添加获取路径的命令
  commandMsg: any = [] // 当前命令信息
  commandArr: any = [] // 过往命令输出
  commandCount = 0 //用与上下键切换标记
  action = false // 是否正在执行命令
  inputDom: any // 输入框dom
  mounted() {
    let dom: any = this.$refs.terminalApp as any
    dom.addEventListener('keyup', this.keyFn) //拖动左侧栏
    this.inputDom = document.querySelector('.terminal-action-contenteditable')
  }
  //切换文件夹 清空历史
  initHandler(newPath: string, oldPath: string) {
    this.isClear('clear')
    this.newPath = newPath
  }
  // 回车执行命令
  keyFn(e: any) {
    if (e.keyCode === 13) {
      //回车键
      this.actionCommand()
      e.preventDefault() //阻止
    } else if (e.keyCode === 38 || e.keyCode === 40) {
      //上下
      this.switchCode(e.keyCode)
      e.preventDefault() //阻止
    }
  }
  //上下键反命令
  switchCode(key: number) {
    const len = this.commandArr.length //总数量
    const c = key === 38 ? this.commandCount - 1 : this.commandCount + 1
    if (c > len || c < 0) return false
    this.inputDom.textContent = this.commandArr[c].command
    this.command = this.commandArr[c].command
    this.commandCount = c
    this.focusInput()
  }
  // 执行命令
  actionCommand() {
    this.isClear(this.command)
    if (this.command === '') {
      this.commandMsg = []
      this.closeCommandAction(0)
      return false
    }
    this.action = true
    const ls = spawn(this.command, {
      cwd: this.newPath, // 执行命令路径
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
      const value = data.toString().trim()
      this.commandMsg.push(`stderr: ${value}`)
      console.error(`stderr: ${value}`)
    })
    // 子进程关闭事件 保存信息 更新状态
    ls.on('close', this.closeCommandAction)
  }
  // 执行完毕 保存信息 更新状态
  closeCommandAction(code: any) {
    const len = this.commandArr.length + 1
    this.commandCount = len
    this.commandArr.push({
      key: len,
      code, // 是否执行成功
      dirPath: this.newPath, // 路径
      command: this.command, // 命令
      commandMsg: this.command.startsWith('cd ')
        ? ''
        : this.commandMsg.join('\r') // 返回信息
    }) // 保存执行信息
    // 清空
    this.updatePath(code)
    this.commandFinish()
    code === 0 ? console.log('success') : console.error('error')
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
  // 更新路径
  updatePath(code: any) {
    if (code !== 0) return
    if (this.command.startsWith('cd ')) {
      if (this.commandMsg.length) {
        this.newPath = this.commandMsg[0]
      } else {
        const sli = this.command.slice(2).trim()
        this.newPath = path.resolve(this.newPath, sli)
      }
    }
  }
  // 保存输入的命令行
  onDivInput(e: any) {
    const content = e.target.textContent.trim()
    if (content !== '') this.command = content
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
