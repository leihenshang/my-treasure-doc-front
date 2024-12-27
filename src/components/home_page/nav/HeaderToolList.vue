<template>
  <div class="header-tool-list-wrapper">
    <div class="tools-wrapper" v-for="tool in toolList" :key="tool.props">
      <n-popover style="padding: 0" trigger="click">
        <template #trigger>
          <div @click="handleClickTool(tool)">
            <n-icon v-if="tool.type==='icon'" :component="ionicons[tool.iconOrTextName]" size="18" :depth="1"/>
            <span v-else>{{ tool.iconOrTextName }}</span>
          </div>
        </template>
        <ul class="select-list-wrapper">
          <li v-for="item in tool.HandleSelectList" :key="item.props" class="select-list"  @click="handleClickTool(item)">
            <n-icon :component="item.iconType==='fluent'?fluent[item.iconName]:ionicons[item.iconName]" size="18" :depth="1"/>
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </n-popover>
    </div>
  </div>
</template>


<script setup lang="ts">
import * as ionicons from '@vicons/ionicons5'
import * as fluent from '@vicons/fluent'
import type {ToolObj} from "@/home-page/nav-type";

defineProps({
  toolList: {type:Array as ()=>ToolObj[]}
})

const emit = defineEmits(['handleClickTool',])
const handleClickTool = (tool:ToolObj)=>{
  if (tool.HandleSelectList?.length) return
  emit('handleClickTool',tool.props)
}
</script>


<style scoped lang="scss">
.header-tool-list-wrapper {
  display: flex;
  align-items: center;
  padding: 0 4px;
  //border-bottom: 1px solid rgb(239, 239, 245);
  //margin-bottom: 10px;
  > .tools-wrapper {
    padding: 10px 4px;
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
.n-popover-shared{
  .select-list-wrapper>.select-list:hover{
    background: rgba(255,255,255,0.09);
  }
}
.select-list-wrapper {
  padding: 4px;
  > .select-list {
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
  }
}
</style>
