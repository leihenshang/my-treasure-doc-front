<template>
  <div class="wrapper" :class="{'dark':globalStore.theme==='dark'}">
    <div class="dashboard-wrapper">
      <header>
        <span>视图：</span>
        <ul class="classify-wrapper">
          <li :class="{'selectedClassify':selectedClassify==='byType'}" @click="toggleClassify('byType')">分组</li>
          <li :class="{'selectedClassify':selectedClassify==='byFree'}" @click="toggleClassify('byFree')">自由</li>
        </ul>
        <n-button type="info" secondary @click="addDashboardCard">
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
    <n-dialog-provider></n-dialog-provider>
    <DashboardCardDialog ref="DashboardCardDialogRef" :id="selectedDashboardId" :dialog-type="dialogType"
                         @updateDashboard="updateDashboard"></DashboardCardDialog>
  </div>
</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import * as fluent from "@vicons/fluent";
import * as ionicons from "@vicons/ionicons5";
import {$_getDashboardList,$_deleteNote,$_updateNote} from "@/api/dashboard";
import DashBoardCard from "@/components/dashboard/DashBoardCard.vue";
import type {Note} from "@/resource";
import DashboardCardDialog from "@/components/dashboard/DashboardCardDialog.vue";
import { useDialog } from 'naive-ui'
import {TreasureResponseList} from "@/treasure_response";
import {useRouter} from "vue-router";
import {useGlobalStore} from "@/stores/global";

type DashboardListItem = {
  title:string,
  type:string,
  content:Note[]
}
const dashTypeBoardList = [{name:'链接',type:'bookmark'},{name:'笔记',type:'note'},{name:'文档',type:'doc'}]
export default {
  name: "DashBoard",
  components:{DashBoardCard,DashboardCardDialog},

  setup(){
    const globalStore = useGlobalStore()
    const router = useRouter();
    const dialog = useDialog()
    const dashboardList = ref<DashboardListItem[]>([])
    const selectedClassify = ref('byType')
    const DashboardCardDialogRef = ref()
    const selectedDashboardId = ref('')
    const dialogType = ref('')

    onMounted(()=>{
      getDashboardList()
    })
    //切换分类
    const toggleClassify = (type:string)=>{
      selectedClassify.value=type
    }
    //删除确认弹窗
    const handleDeleteButtonClick = (noteType='') =>{
      dialog.success({
        title: '删除',
        content: '是否确认删除',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        showIcon:false,
        onPositiveClick: () => {
          $_deleteNote({id:selectedDashboardId.value}).then(() => {
            updateDashboard({noteType})
          })
        }
      })
    }
    //置顶确认弹窗
    const handleTopButtonClick = (noteType='') =>{
      dialog.success({
        title: '置顶',
        content: '是否确认置顶',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        showIcon:false,
        onPositiveClick: () => {
          $_updateNote({id:selectedDashboardId.value,isTop:1}).then(() => {
            updateDashboard({noteType})
          })
        }
      })
    }
    //点击卡片右下角的更多操作
    const handleClickTool = ({handleType='',noteType='',id='',docId=''})=>{
      console.log(handleType,noteType);
      selectedDashboardId.value = id
      if (handleType === 'edit'){
        if (noteType==='doc'){
          router.push({path: `/Editor/${docId}`})
          return
        }
        dialogType.value='update'
        DashboardCardDialogRef.value.showDialog()
      }else if (handleType === 'delete'){
        handleDeleteButtonClick(noteType)
      } else if (handleType === 'top'){
        handleTopButtonClick(noteType)
      }
    }
    //新增一个仪表盘
    const addDashboardCard = ()=>{
      dialogType.value='create'
      DashboardCardDialogRef.value.showDialog()
    }
    //更改原有分类的仪表盘
    const updateClassifyContentList:(noteType:string,data:TreasureResponseList<Note>)=>number = (noteType,data)=>{
      let updateIndex = -1
      dashTypeBoardList.map((item ,index)=>{
        if (item.type===noteType){
          updateIndex = index
          const dashboardListItem = {title:dashTypeBoardList[index].name,type:dashTypeBoardList[index].type,content:data.list}
          dashboardList.value.splice(index,1,dashboardListItem)
        }
      })
      return updateIndex
    }
    //添加新分类的仪表盘
    const addNewClassify = (noteType:string,noteTypeName:string,updateIndex:number,data:TreasureResponseList<Note>) =>{
      if (updateIndex<0){
        dashTypeBoardList.push({name:noteTypeName,type:noteType})
        const dashboardListItem = {title:noteTypeName,type:noteType,content:data.list}
        dashboardList.value.push(dashboardListItem)
      }
    }
    //更新也表盘数据
    const updateDashboard = async ({noteType='',noteTypeName=''})=>{
      await $_getDashboardList({page:1,pageSize:1000,orderBy:'createdAt_desc,id_asc',noteTypes:noteType})
          .then((data)=>{
            const updateIndex = updateClassifyContentList(noteType,data)
            addNewClassify(noteType,noteTypeName,updateIndex,data)
          })
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
    return{fluent, ionicons,dashboardList,selectedClassify,toggleClassify,globalStore
      ,handleClickTool,addDashboardCard,DashboardCardDialogRef,updateDashboard,selectedDashboardId,dialogType}
  }
}

</script>

<style scoped lang="scss">
@import "/src/assets/style/common.scss";
.wrapper{
  padding: 24px;
  background:  var(--theme-background);
  width: 100%;
  height: 100%;
  overflow: auto;
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
            color:var(--theme-color-active);
          }
          &.selectedClassify{
            color:var(--theme-color-active);
            position: relative;
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
        color:var(--theme-color);
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
