<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-04-14 11:21:23
 * @LastEditTime: 2022-06-12 20:06:22
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <router-view />
  <!--异步组件-->
  <Suspense v-if="isUpgrade">
    <template #default>
      <UpgradeComponent />
    </template>
    <template #fallback>
      <h1>检查更新 ...</h1>
    </template>
  </Suspense>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { defineAsyncComponent } from 'vue'
@Options({
  components: {
    //异步加载组件
    UpgradeComponent: defineAsyncComponent(
      () => import('@/components/Upgrade.vue')
    )
  }
})
export default class AppComponent extends Vue {
  isUpgrade = process.env.IS_ELECTRON
    ? process.env.IS_ELECTRON &&
      process.env.NODE_ENV === 'production' &&
      process.env.VUE_APP_UPLOAD !== ''
    : false //判断是否可更新 true是 false否
}
</script>
<style lang="scss"></style>
