<!--
 * @Description: 代码编辑器
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-06-05 12:14:43
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <codemirror
    v-model="code"
    placeholder="请输入..."
    :style="{ height: '100%' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tabSize="4"
    :extensions="extensions"
    @ready="readyFile"
    @change="changeFile"
    @focus="focusFile"
    @blur="blurFile"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { getFileContent, setFileContent } from '@/modular/fsModular'
@Options({
  components: {
    Codemirror
  },
  props: {
    src: String
  }
})
export default class CodemirrorComponent extends Vue {
  // eslint-disable-next-line quotes
  code = ''
  src = ''
  state = 0 //状态 0 未有修改 1 有修改 1
  extensions = [javascript(), oneDark]
  log = console.log
  mounted() {
    this.$nextTick(() => {
      if (this.src) this.getFile()
    })
  }
  // 读取文件内容
  async getFile() {
    getFileContent(this.src)
      .then((res: any) => {
        this.code = res
      })
      .catch((error: any) => {
        //通知父级删除改tabs
        this.$emit('clearTab', this.src, error)
        console.error(error)
      })
  }
  //读取当前页中的内容   包含未提交的
  //是用箭头函数无法获取props接受的值
  async getFileDoc() {
    if (this.state === 1) {
      await setFileContent(this.src, this.code)
      this.state = 0
      this.$emit('updateFileEditState', this.src, 0)
    }
  }
  //文件变动
  changeFile() {
    if (this.state === 0) {
      this.state = 1
      this.$emit('updateFileEditState', this.src, 1)
    }
    // else if (this.state === -1) {
    //   this.state = 0 //第一次加载内容会触发一次 不做编辑状态标记
    // }
  }
  //鼠标进入文件内
  focusFile = (event: any) => {
    console.log('focusFile', event)
  }
  //离开文件
  blurFile = (event: any) => {
    console.log('blurFile', event)
  }
  //准备好的文件
  readyFile = (event: any) => {
    console.log('readyFile', event)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
