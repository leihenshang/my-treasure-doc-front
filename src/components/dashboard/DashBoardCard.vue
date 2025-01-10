<template>
  <div class="dashboard-card-wrapper">
    <div class="top-icon">
      <n-icon :component="antd.LinkOutlined" size="18" :depth="1" v-if="dashboardNote.noteType==='bookmark'"/>
      <n-icon :component="ionicons.DocumentTextOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='note'"/>
      <n-icon :component="ionicons.FolderOpenOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='doc'"/>
      <n-icon :component="ionicons.TimeOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='task'"/>
    </div>
    <div class="content-wrapper">
      <h4 v-if="dashboardNote.noteType === 'doc'">{{dashboardNote.title}}</h4>
      <a v-else-if="dashboardNote.noteType === 'bookmark'" :href="dashboardNote.content">{{dashboardNote.content}}</a>
      <p v-else-if="dashboardNote.noteType==='note'">{{dashboardNote.content}}</p>
    </div>
    <footer>
      <div class="footer-icons">
        <HeaderToolList :tool-list="toolMenuList"  @handleClickTool="handleClickMoreIcon"></HeaderToolList>
<!--        <n-icon :component="ionicons.MenuSharp" size="18" :depth="1"/>-->
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
import HeaderToolList from "@/components/home_page/nav/HeaderToolList.vue";
import type {ToolObj} from "@/home-page/nav-type";

export default {
  name: 'DashboardCard',
  components:{HeaderToolList},
  props:{
    dashboardNote: {type:Object as PropType<Note>,default:()=>{return {}}},
  },

  setup(props,context) {
    const toolMenuList: ToolObj[] = [
      {
        type: 'icon', iconOrTextName: 'MenuSharp', props: 'more',
        HandleSelectList: [{
          label: '编辑',
          iconName: 'DocumentEdit24Regular',
          iconType: 'fluent',
          props: 'logOut'
        },
          {
            label: '删除',
            iconName: 'Delete16Regular',
            props: 'recycleBin',
            iconType: 'fluent'
          },
          {
            label: '置顶',
            iconName: 'PanelTopContract20Regular',
            props: 'userManage',
            iconType: 'fluent'
          },
        ]
      },
    ]
    //点击卡片右下角的更多操作
   const handleClickMoreIcon = (handleType:string)=>{
     context.emit("handleClickTool", {handleType,noteType:props.dashboardNote.noteType})
   }
    return{antd,fluent,ionicons,toolMenuList,handleClickMoreIcon}
  }
}

</script>

<style scoped lang="scss">
@import "/src/assets/style/common.scss";
.dashboard-card-wrapper{
  padding: 30px 10px 10px;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  width: 260px;
  height: 120px;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: $n-box-shadow;

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
    display: flex;
    align-items: center;
    justify-content: space-between;
    > .footer-icons{
      margin-left: auto;
      cursor: pointer;
    }
  }
}
</style>
