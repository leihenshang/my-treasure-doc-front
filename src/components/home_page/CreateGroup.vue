<template>
  <n-modal v-model:show="showModalModel as boolean" preset="dialog" title="Dialog" :show-icon="false"
    class="modal-dialog" :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
    <template #header>
      <div>{{ getModalTileByType(actionName as string) }}</div>
    </template>
    <div class="dialog-container">
      <div class="dialog-content" v-if="actionName != 'updateDoc'">
        <label>名称</label>
        <n-input v-model:value="(updateGroup as DocGroup).title" type="text" placeholder="分组名称"></n-input>
      </div>
      <div class="dialog-content">
        <label>层级</label>
        <n-input :value="selectedTreepath.join('/')" type="text" placeholder="分组名称"></n-input>
        <!--                <n-tree-select v-model:value="(updateGroup as DocGroup).pid" clearable :options="options" key-field="id"-->
        <!--                    :cascade="true" :show-path="true" :allow-checking-not-loaded="true" :on-load="loadGroupTree" />-->
        <n-tree class="tree-wrapper" :data="treeData" :on-load="handleLoad"
          :on-update:selected-keys="selectedNodeChange" block-line selectable />
      </div>
    </div>
    <template #action>
      <n-button type="primary" @click="updateModal(actionName as string)">确定</n-button>
      <n-button @click="showModalModel = false">取消</n-button>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { getDoc, getGroupRoad, updateDoc } from "@/api/doc";
import { createGroup, getDocGroupTree, updateGroup as updateGroupData } from "@/api/doc_group";
import { Doc, DocGroup } from '@/types/resource';
import { buildTreeItem } from '@/utils/common';
import eventBus from "@/utils/event_bus";
import {
  NButton, NTree,
  TreeOption,
  useMessage
} from 'naive-ui';
import { computed, ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'updated', value: TreeOption | DocGroup, prePid?: string): void

}>()
const treeData = ref<Array<TreeOption>>([])
const selectedPId = ref<number | string>('')
const selectedTreepath = ref<Array<string>>([])
const showModalModel = defineModel('show')
const updateGroup = defineModel('updateGroup')
const actionName = defineModel('actionName', { type: String, required: true })
const updateData = computed((): DocGroup => { return updateGroup.value as unknown as DocGroup })
const prePid = ref('')
watch(showModalModel, value => {
  if (value && updateGroup.value) {
    initTreeData()
    prePid.value = (updateGroup.value as DocGroup).pid as string
  }
  console.log(prePid.value);
})
const message = useMessage()
//初始化树节点数据
const initTreeData = () => {
  treeData.value = []
  treeData.value.push(buildTreeItem({
    id: 'root',
    title: '顶层',
    isLeaf: false,
  } as DocGroup))
}
//获取树节点数据
const handleLoad = (node: TreeOption) => {
  return new Promise<void>((resolve, reject) => {
    getDocGroupTree(node.id as string, false).then((response) => {
      if (!response.data) {
        reject()
        return
      }
      const docGroupList = response.data as Array<DocGroup>
      const arr = new Array<TreeOption>()
      docGroupList.map((val) => {
        arr.push(buildTreeItem(val))
      })
      if (arr.length > 0) {
        node.isLeaf = false
      }
      node.children = arr
      resolve()
    }).catch((err) => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
}
//选中树节点变化
const selectedNodeChange = (keys: Array<string | number>, option: Array<TreeOption | null>) => {
  selectedPId.value = option[0]?.id as string
  getSelectedNodeRoad()
}
//获取选中节点的路径
const getSelectedNodeRoad = () => {
  getGroupRoad(selectedPId.value).then(resp => {
    const doc = resp.data as Doc
    if (doc) {
      selectedTreepath.value = doc.groupPathList?.map(item => item.title) || []
    }
  }).catch(err => {
    message.error(err)
  })
}

function getModalTileByType(action: string): string {
  if (action === 'create') {
    return `新增分组`
  } else if (action === 'update') {
    return `编辑分组`
  } else if (action === 'updateDoc') {
    return `编辑文档`
  }
  return ''
}


function updateModal(action: string) {
  if (!updateData.value) {
    return
  }

  const newGroup = { title: updateData.value.title, groupType: '', id: updateData.value.id, pid: selectedPId.value, isLeaf: false } as DocGroup
  if (action === 'updateDoc') {
    if (!selectedPId.value) {
      showModalModel.value = false
      return
    }

    getDoc(updateData.value.id).then((resp) => {
      const docDetail = resp.data as Doc
      updateDoc({
        id: docDetail.id,
        groupId: selectedPId.value,
        version: docDetail.version,
        title: updateData.value.title
      } as Doc).then(() => {
        emit('updated', buildTreeItem({ ...newGroup, groupType: 'doc' }), prePid.value)
        showModalModel.value = false
      }).catch(err => {
        console.log(err)
        message.error(`${err.msg}`)
      })

    }).catch(err => {
      console.log(err)
      message.error(`${err.msg}`)
    })
  }

  if (action == 'update') {
    updateGroupData(updateData.value).then(() => {
      eventBus.emit('updateGroupName', updateData.value)
      emit('updated', updateData.value)
      showModalModel.value = false;
    }).catch(err => {
      console.log(err)
      message.error(`${err.msg}`)
    })
  }
  if (action == 'create') {
    createGroup(newGroup).then((resp) => {
      newGroup.id = (resp?.data as DocGroup).id
      newGroup.isLeaf = true
      emit('updated', buildTreeItem(newGroup))
      showModalModel.value = false;
    }).catch(err => {
      message.error(`${err.msg}`)
    })
  }
}




// async function loadGroupTree(node: TreeOption) {
//     return await new Promise<void>((resolve) => {
//         getDocGroupTree(node.id as string, false).then((response) => {
//             if (!response.data) {
//                 node.children = [];
//                 resolve();
//                 return;
//             }
//
//             let arr = new Array<TreeOption>((response.data as Array<DocGroup>).length);
//             for (const e of response.data as Array<DocGroup>) {
//                 arr.push(buildTreeItem(e));
//             }
//             node.children = arr;
//             resolve();
//         }).catch((err) => {
//             console.log(err);
//         });
//     });
// }


</script>
