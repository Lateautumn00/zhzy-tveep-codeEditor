<!--
 * @Description: 终端 命令行
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-06-10 09:42:53
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div id="terminal" ref="terminal"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Terminal } from 'xterm' // 初始化组件
//import { AttachAddon } from 'xterm-addon-attach' // 给终端窗口绑定功能
import { FitAddon } from 'xterm-addon-fit' // 窗口自适应
import process from 'process'
import pty from 'node-pty'
import os from 'os'
export default class TerminalComponent extends Vue {
  global_xterm: any // 保存terminal实例
  global_pty: any

  mounted() {
    this.$nextTick(() => {
      // const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'

      const shell: any =
        process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
      console.log('这个shell是===', shell, process.env)
      const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.cwd(),
        env: {}
      })
      const xterm = new Terminal({
        cols: 80,
        rows: 30,
        cursorBlink: true
      })
      xterm.open((this.$refs as any).terminal)
      this.global_xterm = xterm
      //this.global_pty = ptyProcess
      const fitAddon = new FitAddon()
      xterm.loadAddon(fitAddon)
      fitAddon.fit()

      xterm.onData((data) => {
        // ptyProcess.write(data)
        console.log('xterm=> ' + data)
      })
      //   ptyProcess.on('data', function (data) {
      //     xterm.write(data)
      //   })
      xterm.onLineFeed(() => {
        const buffer = xterm.buffer
        console.log('这个buffer', buffer)

        //   const newLine = buffer.getLine(buffer.baseY + buffer.cursorY)
        //   if (newLine && !newLine.isWrapped) {
        //     var inputdata = this.getLineData(
        //       buffer,
        //       buffer.baseY + buffer.cursorY - 1
        //     )
        //     // parseCmd(inputdata);
        //     console.log(inputdata)
        //   } else {
        //   }
      })

      // const remote = require('electron').remote
      // var apppath = remote.app.getAppPath()
      // global_pty.write('cd ' + apppath + '\n')
    })
  }
  getLineData(buffer: any, lineIndex: any) {
    let line = buffer.getLine(lineIndex)
    if (!line) {
      return
    }
    let lineData = line.translateToString(true)
    while (lineIndex > 0 && line.isWrapped) {
      line = buffer.getLine(--lineIndex)
      if (!line) {
        break
      }
      lineData = line.translateToString(false) + lineData
    }
    return lineData
  }
  //   initTerm() {
  //     const term = new Terminal({
  //       rendererType: 'canvas', // 渲染类型
  //       rows: 40, // 行数
  //       // cols: 100,// 设置之后会输入多行之后覆盖现象
  //       convertEol: true, // 启用时，光标将设置为下一行的开头
  //       // scrollback: 10,//终端中的回滚量
  //       fontSize: 14, // 字体大小
  //       disableStdin: false, // 是否应禁用输入。
  //       cursorStyle: 'block', // 光标样式
  //       // cursorBlink: true, //光标闪烁
  //       scrollback: 30,
  //       tabStopWidth: 4,
  //       theme: {
  //         foreground: 'yellow', // 字体
  //         background: '#060101', // 背景色
  //         cursor: 'help' // 设置光标
  //       }
  //     })
  //   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
