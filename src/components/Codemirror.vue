<!--
 * @Description: 代码编辑器
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-06-19 15:44:47
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
    class="code"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { getFileContent, setFileContent } from '@/modular/fsModular'
import { TreeList } from '@/types/tree'
@Options({
  components: {
    Codemirror
  },
  props: {
    dataList: Object,
    tabsValue: String
  },
  emits: {
    closeFileAll: null,
    updateFileEditState: null
  }
})
export default class CodemirrorComponent extends Vue {
  code = ''
  dataList: TreeList = {
    index: 4,
    key: '-2',
    label: '',
    src: '',
    isLeaf: true,
    state: 0,
    children: []
  }
  extensions = [javascript(), oneDark]
  fileStatus = false //是否加载完成
  mounted() {
    if (this.dataList.src) this.getFile()
  }
  // 读取文件内容
  getFile() {
    getFileContent(this.dataList.src)
      .then((res: any) => {
        this.code = res
      })
      .catch((error: any) => {
        //通知父级删除改tabs
        ;(this as any).$message.error(error)
        this.$emit('closeFileAll', this.dataList.key, 3)
        console.error(error)
      })
  }
  //读取当前页中的内容   包含未提交的
  //是用箭头函数无法获取props接受的值
  getFileDoc() {
    setFileContent(this.dataList.src, this.code)
    this.$emit('updateFileEditState', this.dataList.key, 0)
  }
  //文件变动
  changeFile() {
    if (!this.fileStatus) {
      this.fileStatus = true
      return false
    }
    if (this.dataList.state === 0) {
      this.$emit('updateFileEditState', this.dataList.key, 1)
    }
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
<style scoped lang="scss">
@use '@/assets/style/mixin.scss' as mixin;
:deep(.cm-scroller::-webkit-scrollbar) {
  /*滚动条整体样式*/
  @include mixin.widthOrHeight(1px, 1px);
}
</style>
