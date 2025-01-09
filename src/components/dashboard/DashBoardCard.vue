<template>
  <div class="dashboard-card-wrapper">
    <div class="top-icon">
      <n-icon :component="antd.LinkOutlined" size="18" :depth="1" v-if="dashboardNote.noteType==='bookmap'"/>
      <n-icon :component="ionicons.DocumentTextOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='note'"/>
      <n-icon :component="ionicons.FolderOpenOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='doc'"/>
      <n-icon :component="ionicons.TimeOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='task'"/>
    </div>
    <div class="content-wrapper">
      <h4 v-if="dashboardNote.noteType === 'doc'">{{dashboardNote.title}}</h4>
      <h4 v-else-if="dashboardNote.noteType === 'bookmap'">{{dashboardNote.title}}</h4>
      <p v-else-if="dashboardNote.noteType==='note'">{{dashboardNote.content}}</p>
    </div>
    <footer>
      <div class="footer-icons">
        <n-icon :component="ionicons.MenuSharp" size="18" :depth="1"/>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import * as antd from "@vicons/antd";
import * as ionicons from "@vicons/ionicons5";
import * as fluent from "@vicons/fluent";
import type {Note} from "@/resource";
import type { PropType } from "vue"

export default {
  name: 'DashboardCard',
  props:{
    dashboardNote: {type:Object as PropType<Note>,default:()=>{return {}}},
  },

  setup() {
    return{antd,fluent,ionicons}
  }
}

</script>

<style scoped lang="scss">
.dashboard-card-wrapper{
  padding: 30px 10px 10px;
  border: 1px solid #e7e9e8;;
  border-radius: 5px;
  width: 260px;
  height: 120px;
  position: relative;
  display: flex;
  flex-direction: column;

  >.top-icon{
    position: absolute;
    top: 8px;
    left: 8px;
  }

  >.content-wrapper{
    padding: 0 8px;
    flex-grow: 1;
  }
  >footer{
    border: 1px solid #e7e9e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > .footer-icons{
      margin-left: auto;
    }
  }
}
</style>
