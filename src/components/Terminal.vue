<!--
 * @Description: 终端 命令行
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-06-05 12:14:43
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div id="terminal"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Terminal } from 'xterm'
export default class TerminalComponent extends Vue {
  mounted() {
    console.log(Terminal)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
