<template>
  <div class="wrapper">
    <div class="dashboard-wrapper">
      <header>
        <span>试图：</span>
        <ul class="classify-wrapper">
          <li :class="{'selectedClassify':selectedClassify==='byType'}" @click="toggleClassify('byType')">分组</li>
          <li :class="{'selectedClassify':selectedClassify==='byFree'}" @click="toggleClassify('byFree')">自由</li>
        </ul>
        <n-button type="info" secondary>
          <template #icon>
            <n-icon :component="ionicons.Add"></n-icon>
          </template>
          新增</n-button>
      </header>
      <div class="dashboard-list-wrapper" v-for="dashboardContent in dashboardList" :key="dashboardContent.type">
        <header>
          <h4>{{ dashboardContent.title }}</h4>
          <n-icon :component="ionicons.ArrowUpCircleOutline" size="18" :depth="1"/>
          <n-icon :component="ionicons.ArrowDownCircleOutline" size="18" :depth="1"/>
          <p>
            <span>修改时间</span>
            <n-icon :component="fluent.ArrowSortDownLines20Regular" size="18" :depth="1"/>
          </p>
        </header>
        <div class="dashboard-card-list-wrapper">
          <DashBoardCard v-for="item in dashboardContent.content" :key="item.id" :dashboard-note="item"
          @handleClickTool="handleClickTool"></DashBoardCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import * as fluent from "@vicons/fluent";
import * as ionicons from "@vicons/ionicons5";
import {$_getDashboardList} from "@/api/dashboard";
import DashBoardCard from "@/components/dashboard/DashBoardCard.vue";
import type {Note} from "@/resource";

type DashboardListItem = {
  title:string,
  type:string,
  content:Note[]
}
const dashTypeBoardList = [{name:'链接',type:'bookmark'},{name:'笔记',type:'note'},{name:'文档',type:'doc'}]
export default {
  name: "DashBoard",
  components:{DashBoardCard},

  setup(){
    const dashboardList = ref<DashboardListItem[]>([])
    const selectedClassify = ref('byType')
    onMounted(()=>{
      getDashboardList()
    })
    //切换分类
    const toggleClassify = (type:string)=>{
      selectedClassify.value=type
    }
    //点击卡片右下角的更多操作
    const handleClickTool = ({handleType='',noteType=''})=>{
      console.log(handleType,noteType);
    }
    //获取仪表盘列表
    const getDashboardList = async()=>{
      for (let i=0;i<dashTypeBoardList.length;i++){
       await $_getDashboardList({page:1,pageSize:1000,orderBy:'createdAt_desc,id_asc',noteTypes:dashTypeBoardList[i].type})
            .then((data)=>{
              const dashboardListItem = {title:dashTypeBoardList[i].name,type:dashTypeBoardList[i].type,content:data.list}
              dashboardList.value.push(dashboardListItem)
            })
      }
    }
    return{fluent, ionicons,dashboardList,selectedClassify,toggleClassify,handleClickTool}
  }
}

</script>

<style scoped lang="scss">
@import "/src/assets/style/common.scss";
.wrapper{
  padding: 24px;
  background: #f7f9fa;
  width: 100%;
  height: 100%;
  //display: flex;
  //justify-content: center;
  .dashboard-wrapper{
    >header{
      display: flex;
      align-items: center;
      font-size: 16px;
      margin-bottom: 10px;
      >.classify-wrapper{
        display: flex;
        align-items: center;
        gap: 10px;
        >span{
          padding-bottom: 2px;
        }
        >li{
          padding-bottom: 2px;
          &:hover{
            cursor: pointer;
            color:$color-active;
          }
          &.selectedClassify{
            color:$color-active;
            position: relative;
            //border-bottom: 2px solid $color-active;
            &:after{
              content:"";
              display: block;
              width: 32px;
              height: 2px;
              background: $color-active;
              position: absolute;
              bottom: 0;
              left: 0;
            }
          }
        }
      }
      >button{
        width: 76px;
        height: 29px;
        margin-left: auto;
      }
    }
    >.dashboard-list-wrapper{
      margin-bottom: 20px;
      >header{
        display: flex;
        align-items: center;
        color:$font-color-1;
        margin-bottom: 8px;
        >h4{
          font-size: 20px;
          margin-right: 8px;
        }
        >p{
          margin-left: 8px;
        }
      }
      >.dashboard-card-list-wrapper{
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
    }
  }

}
</style>
