<template>
  <div class="header-tool-list-wrapper">
    <div class="tools-wrapper" v-for="tool in toolList" :key="tool.props">
      <n-icon v-if="tool.type==='icon'" :component="ionicons[tool.iconOrTextName]" size="18" :depth="1" />
      <span v-else>{{tool.iconOrTextName}}</span>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from "vue";
import * as ionicons from '@vicons/ionicons5'

type HandleSelectObj = {
  label:string,
  props:string,
}
type ToolObj = {
  type: 'text' | 'icon',
  iconOrTextName:string,
  props:string,
  HandleSelectList?:HandleSelectObj[]
}
const defaultList:ToolObj[] = [
    {type:'icon',iconOrTextName:'Search',props:'search'},
    {type:'icon',iconOrTextName:'FolderOutline',props:'addDirectory'},
    {type:'icon',iconOrTextName:'PencilOutline',props:'addNote'},
    {type:'icon',iconOrTextName:'EllipsisHorizontalCircleOutline',props:'more'},
    {type:'icon',iconOrTextName:'SunnyOutline',props:'theme'},
]


const toolList = ref<ToolObj[]>(defaultList)
</script>


<style scoped lang="scss">
.header-tool-list-wrapper{
  display: flex;
  align-items: center;
  padding: 0 4px;
  //border-bottom: 1px solid rgb(239, 239, 245);
  //margin-bottom: 10px;
  > .tools-wrapper{
    padding: 10px 4px;
    width: 20%;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
    &:hover{
      cursor: pointer;
    }
    >.n-icon:hover{
      color: #36ad6a;
    }
  }
}
</style>
