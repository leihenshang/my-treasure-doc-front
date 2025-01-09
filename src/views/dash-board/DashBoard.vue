<template>
<div class="dashboard-wrapper">
  <div class="dashboard-list-wrapper" v-for="dashboardContent in defaultDashboardList" :key="dashboardContent.type">
    <header>
      <h4>dashboardContent.title</h4>
      <n-icon :component="ionicons.ArrowUpCircleOutline" size="18" :depth="1"/>
      <n-icon :component="ionicons.ArrowDownCircleOutline" size="18" :depth="1"/>
      <p>
        <span>修改时间</span>
        <n-icon :component="fluent.ArrowSortDownLines20Regular" size="18" :depth="1"/>
      </p>
    </header>

  </div>
</div>
</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import * as fluent from "@vicons/fluent";
import * as ionicons from "@vicons/ionicons5";
import {$_getDashboardList} from "@/api/dashboard";

type DashboardContent = {
  id:string,
  typeIconName:string,
  headerName?:string,
  content:string,
  type:string,
  footerName?:string,
}
type DashboardListItem = {
  title:string,
  type:string,
  content:DashboardContent[]
}
const dashTypeBoardList = [{name:'链接',type:'bookmap'},{name:'笔记',type:'note'},{name:'文档',type:'doc'}]
export default {
  name: "DashBoard",

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
.dashboard-wrapper{

}
</style>
