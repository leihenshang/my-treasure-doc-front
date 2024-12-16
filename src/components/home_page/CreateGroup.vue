<template>
    <n-modal v-model:show="showModalModel as boolean" preset="dialog" title="Dialog" :show-icon="false"
        class="modal-dialog" :mask-closable=false
        style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            <div>{{ getModalTileByType(handleType as string) }}</div>
        </template>
        <div class="dialog-container">
            <div class="dialog-content" v-if="handleType != 'updateDoc'">
                <label>名称</label>
                <n-input v-model:value="updateModalName" type="text" placeholder="分组名称"></n-input>
            </div>
            <div class="dialog-content">
                <label>层级</label>
                <n-tree-select v-model:value="updateModalPid" clearable :options="options" key-field="id"
                    :cascade="true" :show-path="true" :allow-checking-not-loaded="true" :on-load="loadTree" />
            </div>
        </div>
        <template #action>
            <n-button type="primary" @click="updateModal(handleType as string)">确定</n-button>
            <n-button @click="showModalModel = false">取消</n-button>
        </template>
    </n-modal>
</template>
<script setup lang="ts">
import { getDoc, updateDoc } from "@/api/doc";
import { createGroup, getDocGroupTree, updateGroup as updateGroupData } from "@/api/doc_group";
import { Doc, DocGroup } from '@/types/resource';
import { TreasureResponse } from "@/types/treasure_response";
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
    (e: 'recursionReload', value: number): void

}>()

const showModalModel = defineModel('show')
const updateGroup = defineModel('updateGroup')
const handleType = defineModel('handleType', { type: String, required: true })
const updateModalName = ref('')
const updateModalPid = ref(0)
const options = ref([
    {
        label: '顶层',
        key: 0,
        id: 0,
        depth: 1,
        isLeaf: false
    }
])


const newGroup = reactive<DocGroup>({ title: '', groupType: '', id: 0, pid: 0 });
const message = useMessage()

function getModalTileByType(handleType: string): string {
    if (handleType === 'create') {
        return `新增分组`
    } else if (handleType === 'update') {
        return `编辑分组`
    } else if (handleType === 'updateDoc') {
        return `编辑文档`
    }
    return ''
}

watch(updateGroup, (newGroup) => {
    const group = newGroup as DocGroup
    updateModalName.value = group.title
    updateModalPid.value = group.pid || -1
})

function updateModal(type: string) {
    const updateGroupCopy = updateGroup.value as unknown as DocGroup
    if (type === 'updateDoc') {
        if (updateModalPid.value < 0) {
            showModalModel.value = false
            clearModal()
            return
        }

        getDoc(updateGroupCopy.id).then((resp) => {
            const newDoc = new TreasureResponse<Doc>(resp?.code, resp?.msg, resp?.data)
            console.log(newDoc.getData())
            const docDetail = resp.data as Doc
            updateDoc({
                id: docDetail.id,
                groupId: updateModalPid.value,
                version: docDetail.version
            } as Doc).then(() => {
                showModalModel.value = false
                clearModal()
                emit('recursionReload', updateGroupCopy.pid || 0)
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
        if (updateModalPid.value > 0) {
            updateGroupCopy.pid = updateModalPid.value
        }
        updateGroupData(updateGroupCopy).then(() => {
            clearModal()
            eventBus.emit('updateGroupName', updateGroupCopy)
            emit('recursionReload', updateGroupCopy.pid || 0)
        }).catch(err => {
            message.error(err)
        })
    }

    if (type == 'create') {
        newGroup.title = updateModalName.value
        if (updateModalPid.value > 0) {
            newGroup.pid = updateModalPid.value
        }
        createGroup(newGroup).then((resp) => {
            clearModal()
            if (newGroup.pid == 0) {
                const newItem = Object.assign({}, newGroup)
                newItem.id = resp?.getData()?.id
                newItem.isLeaf = true
                emit('addTreeItem', buildTreeItem(newItem))
            } else {
                emit('recursionReload', newGroup.pid || 0)
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
    updateModalPid.value = -1
}


function loadTree(node: TreeOption) {
    console.log(node)
    return new Promise<void>((resolve) => {
        getDocGroupTree(node.id as number, false).then((response) => {
            if (!response.data) {
                node.children = []
                resolve()
                return
            }

            let arr = new Array<TreeOption>((response.data as Array<DocGroup>).length)
            for (const e of response.data as Array<DocGroup>) {
                arr.push(buildTreeItem(e))
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


</script>