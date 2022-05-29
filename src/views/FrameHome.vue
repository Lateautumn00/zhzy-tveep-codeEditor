<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-04-14 11:21:23
 * @LastEditTime: 2022-05-22 12:51:10
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorldComponent :msg="msg.title" />
    <el-button type="primary" @click="nextTip">下一步提示</el-button>
    <el-button type="primary" @click="getData">远程数据</el-button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorldComponent from '@/components/HelloWorld.vue'
import { reactive } from 'vue'
//import { ElMessage } from 'element-plus'
import { getList } from '@/api/demo'
interface Msg {
  num: number
  title: string
}
@Options({
  components: {
    HelloWorldComponent
  }
})
export default class FrameHomeComponent extends Vue {
  msg: Msg = reactive<Msg>({ num: 0, title: 'Welcome to Your' })
  getData = async () => {
    const { statusCode, message, data } = await getList({})
    console.log(statusCode, message, data)
  }
  nextTip = () => {
    if (this.msg.num === 0) {
      this.msg.num = 1
      this.msg.title = this.msg.title + ' Vue3.js + TypeScript + Electron App'
    }

    //ElMessage('this is a message.')
    console.log(this.msg)
    console.log(process.env)
  }
}
</script>
