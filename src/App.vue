<template>
  <n-config-provider :theme="globalStore.currentTheme" :locale="zhCN" :date-locale="dateZhCN" abstract>
    <n-message-provider>
      <router-view></router-view>
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global';
import { dateZhCN, NMessageProvider, zhCN } from "naive-ui";
import './assets/style/reset.scss';

const globalStore = useGlobalStore()

</script>
<style type="text/css"></style>
