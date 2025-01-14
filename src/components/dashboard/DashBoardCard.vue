<template>
  <div class="dashboard-card-wrapper" :class="{'no-title-dashboard-card-wrapper':hasNoTitle}">
    <div class="top-icon-wrapper">
      <n-icon :component="antd.LinkOutlined" size="18" :depth="1" v-if="dashboardNote.noteType==='bookmark'"/>
      <n-icon :component="ionicons.DocumentTextOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='note'"/>
      <n-icon :component="ionicons.FolderOpenOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='doc'"/>
      <n-icon :component="ionicons.TimeOutline" size="18" :depth="1" v-else-if="dashboardNote.noteType==='task'"/>
    </div>
    <div class="content-wrapper">
      <h4 v-if="!hasNoTitle">{{dashboardNote.title}}</h4>
      <div class="content" :class="{'no-title-content':hasNoTitle}">
        <a v-if="dashboardNote.noteType === 'bookmark'" :href="dashboardNote.content" target="_blank">
          {{dashboardNote.content}}
        </a>
        <p v-else-if="dashboardNote.noteType==='note' || dashboardNote.noteType === 'doc'"
           :title="dashboardNote.noteType==='note'?dashboardNote.content:''">{{dashboardNote.content}}</p>
      </div>
    </div>
    <footer>
      <div class="footer-icons">
        <HeaderToolList :tool-list="toolMenuList"  @handleClickTool="handleClickMoreIcon"></HeaderToolList>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import * as antd from "@vicons/antd";
import * as ionicons from "@vicons/ionicons5";
import * as fluent from "@vicons/fluent";
import type {Note} from "@/resource";
import {computed, PropType} from "vue"
import HeaderToolList from "@/components/home_page/nav/HeaderToolList.vue";
import type {ToolObj} from "@/home-page/nav-type";

export default {
  name: 'DashboardCard',
  components:{HeaderToolList},
  props:{
    dashboardNote: {type:Object as PropType<Note>,default:()=>{return {}}},
  },

  setup(props,context) {
    const hasNoTitle = computed(()=>{
     return props.dashboardNote.noteType === 'note'
    })
    const toolMenuList: ToolObj[] = [
      {
        type: 'icon', iconOrTextName: 'MenuSharp', props: 'more',
        HandleSelectList: [{
          label: '编辑',
          iconName: 'DocumentEdit24Regular',
          iconType: 'fluent',
          props: 'edit'
        },
          {
            label: '删除',
            iconName: 'Delete16Regular',
            props: 'delete',
            iconType: 'fluent'
          },
          {
            label: '置顶',
            iconName: 'PanelTopContract20Regular',
            props: 'top',
            iconType: 'fluent'
          },
        ]
      },
    ]
    //点击卡片右下角的更多操作
   const handleClickMoreIcon = (handleType:string)=>{
     context.emit("handleClickTool", {handleType,noteType:props.dashboardNote.noteType,id:props.dashboardNote.id})
   }
    return{antd,fluent,ionicons,toolMenuList,handleClickMoreIcon,hasNoTitle}
  }
}

</script>

<style scoped lang="scss">
@import "/src/assets/style/common.scss";
.dashboard-card-wrapper{
  padding: 20px 10px 10px;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  width: 260px;
  height: 130px;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: $n-box-shadow;
  &.no-title-dashboard-card-wrapper{
    padding-top: 30px;
    height: 140px;
  }
  >.top-icon-wrapper{
    position: absolute;
    top: 8px;
    left: 8px;
  }

  >.content-wrapper{
    padding: 0 8px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    >h4{
      text-align: center;
      font-size: 16px;
    }
    >.content{
      display: flex;
      align-items: center;
      text-overflow: ellipsis;
      >*{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        cursor: pointer;
      }
      &.no-title-content{
        >*{
          -webkit-line-clamp: 3;
        }
      }
    }
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
