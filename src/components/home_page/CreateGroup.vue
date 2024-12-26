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
                <n-input v-model:value="updateModalName" type="text" placeholder="分组名称"></n-input>
            </div>
            <div class="dialog-content">
                <label>层级</label>
                <n-tree-select v-model:value="updateModalPid" clearable :options="options" key-field="id"
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
import { reactive, ref, watch } from 'vue';

const emit = defineEmits<{
    (e: 'addTreeItem', value: TreeOption): void
    (e: 'recursionReload', value: string): void

}>()

const showModalModel = defineModel('show')
const updateGroup = defineModel('updateGroup')
const actionName = defineModel('actionName', { type: String, required: true })
const updateModalName = ref('')
const updateModalPid = ref('')
const options = ref([
    {
        label: '顶层',
        key: 'root',
        id: 'root',
        depth: 1,
        isLeaf: false
    }
])


const newGroup = reactive<DocGroup>({ title: '', groupType: '', id: '', pid: '' });
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

watch(updateGroup, (newGroup) => {
    const group = newGroup as DocGroup
    updateModalName.value = group.title
    updateModalPid.value = group.pid || ''
})

function updateModal(type: string) {
    const updateGroupCopy = updateGroup.value as unknown as DocGroup
    if (type === 'updateDoc') {
        if (!updateModalPid.value) {
            showModalModel.value = false
            clearModal()
            return
        }

        getDoc(updateGroupCopy.id).then((resp) => {
            const docDetail = resp.data as Doc
            updateDoc({
                id: docDetail.id,
                groupId: updateModalPid.value,
                version: docDetail.version
            } as Doc).then(() => {
                showModalModel.value = false
                clearModal()
                emit('recursionReload', updateGroupCopy.pid || '')
            }).catch(err => {
                message.error(`${err.msg}`)
                console.log(err)
            })

        }).catch(err => {
            message.error(`${err}`)
            console.log(err)
        })



    }

    if (type == 'update') {
        updateGroupCopy.title = updateModalName.value
        if (updateModalPid.value) {
            updateGroupCopy.pid = updateModalPid.value
        }
        updateGroupData(updateGroupCopy).then(() => {
            clearModal()
            eventBus.emit('updateGroupName', updateGroupCopy)
            emit('recursionReload', updateGroupCopy.pid || '')
        }).catch(err => {
            message.error(err)
        })
    }

    if (type == 'create') {
        newGroup.title = updateModalName.value
        if (updateModalPid.value) {
            newGroup.pid = updateModalPid.value
        }
        createGroup(newGroup).then((resp) => {
            clearModal()
            if (newGroup.pid) {
                const newItem = Object.assign({}, newGroup)
                newItem.id = resp?.getData()?.id
                newItem.isLeaf = true
                emit('addTreeItem', buildTreeItem(newItem))
            } else {
                emit('recursionReload', newGroup.pid || '')
            }
        }).catch(err => {
            console.log(err)
            message.error(`${err}`)
        })
    }

    showModalModel.value = false;
}


function clearModal() {
    updateModalName.value = ''
    updateModalPid.value = ''
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