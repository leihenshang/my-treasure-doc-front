<template>
<div class="dashboard-wrapper">
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
      <DashBoardCard v-for="item in dashboardContent.content" :key="item.id"></DashBoardCard>
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
const dashTypeBoardList = [{name:'链接',type:'bookmap'},{name:'笔记',type:'note'},{name:'文档',type:'doc'}]
export default {
  name: "DashBoard",
  components:{DashBoardCard},

  setup(){
    const dashboardList = ref<DashboardListItem[]>([])
    onMounted(()=>{
      getDashboardList()
    })
    //获取仪表盘列表
    const getDashboardList = ()=>{
      for (let i=0;i<dashTypeBoardList.length;i++){
        $_getDashboardList({page:1,pageSize:1000,orderBy:'createdAt_desc,id_asc',noteTypes:dashTypeBoardList[i].type})
            .then((data)=>{
              const dashboardListItem = {title:dashTypeBoardList[i].name,type:dashTypeBoardList[i].type,content:data.list}
              dashboardList.value.push(dashboardListItem)
            })
      }
    }
    return{fluent, ionicons,dashboardList}
  }
}

</script>

<style scoped lang="scss">
@import "/src/assets/style/common.scss";
.dashboard-wrapper{
  padding: 16px;
>.dashboard-list-wrapper{
  >header{
    display: flex;
    align-items: center;
    color:$font-color-1;
    >h4{
      font-size: 20px;
      margin-right: 8px;
    }
    >p{
      margin-left: 8px;
    }
  }
}
}
</style>
