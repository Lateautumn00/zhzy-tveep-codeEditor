<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-20 17:02:45
 * @LastEditTime: 2022-05-20 17:14:13
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div class="left">
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
export default class LeftComponent extends Vue {
  defaultProps = {
    children: 'children',
    label: 'label'
  }
  data: any = [
    {
      label: '我的项目',
      children: [
        {
          label: '项目一'
        },
        {
          label: '项目二'
        }
      ]
    },
    {
      label: '我的收藏',
      children: [
        {
          label: '123',
          children: [
            {
              label: 'Level three 2-1-1'
            }
          ]
        }
      ]
    },
    {
      label: '最近访问',
      children: [
        {
          label: '1111',
          children: [
            {
              label: 'Level three 3-1-1'
            }
          ]
        }
      ]
    }
  ]
  handleNodeClick = (data: any) => {
    console.log(data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
