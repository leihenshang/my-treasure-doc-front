<template>
  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
    <template #header>
      <div>标题</div>
    </template>
    <div>内容</div>
    <template #action>
      <div>操作</div>
    </template>
  </n-modal>
</template>

<script lang="ts">
import {defineComponent,ref} from "vue";

export default defineComponent({
  name: "DashboardCardDialog",
  setup() {
    const showModal = ref(false)
    return {showModal}
  }
})

</script>

<style scoped lang="scss">

</style>
