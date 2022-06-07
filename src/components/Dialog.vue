<!--
 * @Description: 弹框
 * @Author: lanchao
 * @Date: 2022-05-20 17:02:45
 * @LastEditTime: 2022-06-07 21:29:17
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="data.title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="data">
      <el-form-item label="名称">
        <el-input v-model="data.name" />
      </el-form-item>
    </el-form>
    <!-- <div>文件路径:{{ data.src }}\{{ data.name }}</div> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component'
interface DialogData {
  title: string
  type: number
  src: string
  name: string
}
export default class DialogComponent extends Vue {
  dialogVisible = false
  data: any = {
    title: '',
    type: 1,
    src: '',
    name: ''
  }
  // eslint-disable-next-line no-undef
  openDialog(data: DialogData) {
    this.data = data
    this.dialogVisible = true
  }
  handleClose() {
    this.dialogVisible = false
  }
  submitForm() {
    ;(this.$parent as any).operationFile(this.data)
    this.handleClose()
  }
}
</script>
