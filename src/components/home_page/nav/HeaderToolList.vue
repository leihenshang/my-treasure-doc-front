<template>
  <div class="header-tool-list-wrapper">
    <div class="tools-wrapper" v-for="tool in toolList" :key="tool.props">
      <n-popover placement="bottom" style="padding: 0">
        <template #trigger>
          <div @click="handleClickTool(tool)">
            <n-icon v-if="tool.type === 'icon'" :component="ionicons[tool.iconOrTextName] as any" size="18"
              :depth="1" />
            <span v-else>{{ tool.iconOrTextName }}</span>
          </div>
        </template>
        <ul class="select-list-wrapper">
          <li v-for="item in tool.HandleSelectList" :key="item.props" class="select-list"
            :class="{ 'dark-theme-select-list': globalStore.theme === 'dark' }" @click="handleClickTool(item)">
            <n-icon v-if="item.iconName"
              :component="item.iconType === 'fluent' ? (fluent[item.iconName] as any) : (ionicons[item.iconName] as any)"
              size="18" :depth="1" />
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </n-popover>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { ToolObj } from "@/home-page/nav-type";
import { useGlobalStore } from "@/stores/global";
import * as fluentImport from '@vicons/fluent';
import * as ioniconsImport from '@vicons/ionicons5';
const fluent = fluentImport as Record<string, unknown>;
const ionicons = ioniconsImport as Record<string, unknown>;
defineProps({
  toolList: { type: Array as () => ToolObj[] }
})
const globalStore = useGlobalStore()
const emit = defineEmits(['handleClickTool',])
const handleClickTool = (tool: ToolObj | unknown) => {
  if ((tool as ToolObj).HandleSelectList?.length) return
  emit('handleClickTool', (tool as ToolObj).props)
}
</script>


<style scoped lang="scss">
.header-tool-list-wrapper {
  display: flex;
  align-items: center;
  padding: 0 4px;

  //border-bottom: 1px solid rgb(239, 239, 245);
  //margin-bottom: 10px;
  >.tools-wrapper {
    //padding: 10px 4px;
    width: 25%;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;

    &:hover {
      cursor: pointer;
    }

    .n-icon:hover {
      color: #36ad6a;
    }

  }
}

.select-list-wrapper {
  padding: 4px;

  >.select-list {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color .3s;

    &:hover {
      background: #f3f3f5;
    }

    span {
      white-space: nowrap;
      margin-left: 16px;
    }

    &.dark-theme-select-list {
      &:hover {
        background: rgba(255, 255, 255, 0.09);
      }
    }
  }
}
</style>
