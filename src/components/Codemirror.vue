<!--
 * @Description: 
 * @Author: lanchao
 * @Date: 2022-05-30 16:34:16
 * @LastEditTime: 2022-05-31 12:30:00
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
    @ready="log('ready', $event)"
    @change="log('change', $event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { ref } from 'vue'
@Options({
  components: {
    Codemirror
  }
})
export default class CodemirrorComponent extends Vue {
  // eslint-disable-next-line quotes
  code = ref('')
  extensions = [javascript(), oneDark]
  log = console.log
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
