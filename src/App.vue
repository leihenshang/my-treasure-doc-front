<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<script>
import './assets/style/reset.scss'

export default {
  name: 'App',
}
</script>
<style type="text/css">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

body {
  color: #262626;
}
</style>
