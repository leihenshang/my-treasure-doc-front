<template>
    <n-modal v-model:show="showModal as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            <div>{{ getModalTileByType(groupHandleType) }}</div>
        </template>
        <div class="dialog-container">
            <div class="dialog-content" v-if="groupHandleType != 'updateDoc'">
                <label>名称</label>
                <n-input v-model:value="updateModalName" type="text" placeholder="分组名称"></n-input>
            </div>
            <div class="dialog-content">
                <label>层级</label>
                <n-tree-select v-model:value="updateModalPid" clearable :options="options" :cascade="true"
                    :show-path="true" :allow-checking-not-loaded="true" :on-load="handleLoadWithUpdateGroupLocation" />
            </div>
        </div>
        <template #action>
            <n-button type="primary" @click="updateModal(groupHandleType)">确定</n-button>
            <n-button @click="showModal = false">取消</n-button>
        </template>
    </n-modal>

</template>
<script setup lang="ts">
import { updateDoc } from "@/api/doc";
import { getDocGroupTree } from "@/api/doc_group";
import { Doc, DocGroup } from '@/types/resource';
import { FolderOutline } from '@vicons/ionicons5';
import {
    NButton,
    NIcon,
    TreeOption
} from 'naive-ui';
import { h, ref } from 'vue';

const showModal = defineModel('showModal')
const groupHandleType = ref('')
const updateModalName = ref('')
const updateModalPid = ref(0)
const options = ref([
    {
        label: '顶层',
        key: 0,
        depth: 1,
        isLeaf: false
    }
])
const updateModalDocId = ref(0)

function getModalTileByType(type: string): string {
    if (type === 'create') {
        return `新增分组`
    } else if (type === 'update') {
        return `编辑分组`
    } else if (type === 'updateDoc') {
        return `编辑文档`
    }
    return ''
}

function updateModal(type: string) {
    if (type === 'updateDoc') {
        if (updateModalPid.value < 0) {
            showModal.value = false
            clearModal()
            return
        }

        updateDoc({
            id: updateModalDocId.value,
            groupId: updateModalPid.value
        } as Doc).then(() => {
            showModal.value = false
            clearModal()
            // refreshTree()
        }).catch(err => {
            console.log(err)
        })
    } else {
        // createOrUpdateGroup()
    }
}

function clearModal() {
    updateModalName.value = ''
    updateModalPid.value = -1
    updateModalDocId.value = 0
}


function handleLoadWithUpdateGroupLocation(node: TreeOption) {
    return new Promise<void>((resolve) => {
        getDocGroupTree(node.key as number, false).then((response) => {
            if (!response.data) {
                node.children = []
                resolve()
                return
            }

            let arr: any = new Array<any>((response.data as Array<DocGroup>).length)
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

function buildTreeItem(d: DocGroup) {
    return {
        label: d.title,
        key: d.id,
        isLeaf: d.groupType == 'doc',
        groupType: d.groupType,
        prefix: () => h(NIcon, { color: "#FCB334" }, { default: () => h(FolderOutline) }),
        pid: d.pid
    }
}

</script>