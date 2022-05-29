<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-04-14 11:21:23
 * @LastEditTime: 2022-05-28 17:38:12
 * @LastEditors: lanchao
 * @Reference: 
-->
<template>
  <div id="app">
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
  </div>
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
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 16px;
}
</style>
