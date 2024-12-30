<template>
    <n-modal v-model:show="showModalModel as boolean" preset="dialog" title="Dialog" :show-icon="false"
        class="modal-dialog" :mask-closable=false
        style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
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
                <n-tree-select v-model:value="(updateGroup as DocGroup).pid" clearable :options="options" key-field="id"
                    :cascade="true" :show-path="true" :allow-checking-not-loaded="true" :on-load="loadGroupTree" />
            </div>
        </div>
        <template #action>
            <n-button type="primary" @click="updateModal(actionName as string)">确定</n-button>
            <n-button @click="showModalModel = false">取消</n-button>
        </template>
    </n-modal>
</template>
<script setup lang="ts">
import { getDoc, updateDoc } from "@/api/doc";
import { createGroup, getDocGroupTree, updateGroup as updateGroupData } from "@/api/doc_group";
import { Doc, DocGroup } from '@/types/resource';
import { buildTreeItem } from '@/utils/common';
import eventBus from "@/utils/event_bus";
import {
    NButton,
    TreeOption,
    useMessage
} from 'naive-ui';
import { computed, ref } from 'vue';

const emit = defineEmits<{
    (e: 'updated', value: TreeOption): void

}>()

const showModalModel = defineModel('show')
const updateGroup = defineModel('updateGroup')
const actionName = defineModel('actionName', { type: String, required: true })
const options = ref([
    {
        label: '顶层',
        key: 'root',
        id: 'root',
        depth: 1,
        isLeaf: false
    }
])
const updateData = computed((): DocGroup => { return updateGroup.value as unknown as DocGroup })
const message = useMessage()

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

    const newGroup = { title: updateData.value.title, groupType: '', id: updateData.value.id, pid: updateData.value.pid, isLeaf: false } as DocGroup
    if (action === 'updateDoc') {
        if (!updateData.value.pid) {
            showModalModel.value = false
            return
        }

        getDoc(updateData.value.id).then((resp) => {
          const docDetail = resp.data as Doc
            updateDoc({
                id: docDetail.id,
                groupId: updateData.value.pid,
                version: docDetail.version,
                title: updateData.value.title
            } as Doc).then(() => {
                emit('updated', buildTreeItem(newGroup))
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
            emit('updated',updateData.value)
            showModalModel.value = false;
        }).catch(err => {
            console.log(err)
            message.error(`${err.msg}`)
        })
    }
    if (action == 'create') {
        createGroup(newGroup).then((resp) => {
            newGroup.id = resp?.getData()?.id
            newGroup.isLeaf = true
            emit('updated', buildTreeItem(newGroup))
            showModalModel.value = false;
        }).catch(err => {
            message.error(`${err.msg}`)
        })
    }
}




async function loadGroupTree(node: TreeOption) {
    return await new Promise<void>((resolve) => {
        getDocGroupTree(node.id as string, false).then((response) => {
            if (!response.data) {
                node.children = [];
                resolve();
                return;
            }

            let arr = new Array<TreeOption>((response.data as Array<DocGroup>).length);
            for (const e of response.data as Array<DocGroup>) {
                arr.push(buildTreeItem(e));
            }
            node.children = arr;
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });
}


</script>
