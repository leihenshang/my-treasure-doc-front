<template>
    <div class="edit-box">
        <template v-if="props.id">
            <div class="edit-banner">
                <n-space>
                    <n-button default round size="tiny" @click="showHistoryModal = !showHistoryModal">
                        <template #icon>
                            <n-icon size="20">
                                <History16Filled></History16Filled>
                            </n-icon>
                        </template>
                        历史
                    </n-button>
                    <n-switch :disabled="currentDoc.deletedAt !== null" v-model:value="isTop" size="small"
                        @click=" currentDoc.deletedAt === null && contentUpdate(currentDoc, true)">
                        <template #icon>
                            {{ isTop ? '😄' : '🤔' }}
                        </template>
                        <template #unchecked>
                            没置顶
                        </template>
                        <template #checked>
                            置顶了
                        </template>
                    </n-switch>
                    <n-switch :disabled="currentDoc.deletedAt !== null" v-model:value="isPin" size="small"
                        @click=" currentDoc.deletedAt === null && contentUpdate(currentDoc, false)">
                        <template #icon>
                            {{ isPin ? '😄' : '🥲' }}
                        </template>
                        <template #unchecked>
                            没钉住
                        </template>
                        <template #checked>
                            钉住了
                        </template>
                    </n-switch>
                    <n-switch :disabled="currentDoc.deletedAt !== null" v-model:value="readOnly" size="small"
                        @click=" currentDoc.deletedAt === null && contentUpdate(currentDoc, false, true)">
                        <template #icon>
                            {{ readOnly ? '🥲' : '😄' }}
                        </template>
                        <template #unchecked>
                            读写
                        </template>
                        <template #checked>
                            只读
                        </template>
                    </n-switch>
                    <n-breadcrumb>
                        <n-breadcrumb-item v-for="group in currentDoc.groupPath" :clickable=false :key="group.id">
                            {{ group.title }}
                        </n-breadcrumb-item>
                        <n-breadcrumb-item>
                            {{ currentDoc.title }}
                        </n-breadcrumb-item>
                    </n-breadcrumb>
                </n-space>
            </div>
            <div class="edit-content">
                <Vditor :doc="currentDoc" @update-doc="contentUpdate" />
            </div>
        </template>
        <div v-else class="empty-doc">
            <n-empty description="我们终其一生都在追寻的是什么？" size="huge">
                <template #extra>
                    <n-button size="small">
                        先写一个文档试试 ~
                    </n-button>
                </template>
            </n-empty>
        </div>
    </div>
    <DocHistory v-model:show="showHistoryModal" v-model:doc-id="currentDoc.id"
        v-on:refresh-doc="getSetCurrentDoc(props.id)">
    </DocHistory>
</template>
<script lang="ts" setup>
import { createDoc, getDoc, updateDoc } from "@/api/doc";
import DocHistory from '@/components/doc/DocHistory.vue';
import Vditor from '@/components/editor/Vditor.vue';
import { Doc, DocGroup } from "@/types/resource";
import eventBus from '@/utils/event_bus';
import { History16Filled } from "@vicons/fluent";
import { NIcon, useMessage } from 'naive-ui';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";


const props = defineProps<{
    id: string,
}>()
const currentDoc = ref<Doc>({ title: '' } as Doc)
const message = useMessage()
const isTop = ref(false)
const isPin = ref(false)
const readOnly = ref(false)
const showHistoryModal = ref(false)
const router = useRouter()

function contentUpdate(docUpdate: Doc, onlyIsTop: boolean = false, isReadOnly: boolean = false) {
    currentDoc.value.title = docUpdate.title || ''
    docUpdate.isTop = isTop.value ? 1 : 2
    docUpdate.isPin = isPin.value ? 1 : 2
    docUpdate.readOnly = readOnly.value ? 1 : 2
    docUpdate.version = currentDoc.value.version
    docUpdate.groupId = currentDoc.value.groupId
    if (docUpdate.id) {
        updateDoc(docUpdate).then((resp) => {
            if (onlyIsTop) {
                eventBus.emit('updateTopDoc')
            }
            if (isReadOnly) {
                eventBus.emit('updateReadOnly', readOnly.value)
            }
            currentDoc.value.version = (resp.data as Doc).version || 0
        }).catch(err => {
            if (err?.code === 10000) {
                message.error(err?.msg)
                return
            }

            console.log(err)
            message.error(`${err}`)
        })
    } else if (docUpdate.title != '') {
        createDoc(docUpdate).then(res => {
            currentDoc.value.id = res.getData().id
            if (isTop.value) {
                eventBus.emit('updateTopDoc')
            }
        }).catch(err => {
            message.error(err)
        })
    }

}

// 为了保证当直接进入页面的时候不会获取到默认的缓存数据
onMounted(async () => {
    getSetCurrentDoc(props.id)
    eventBus.on('updateGroupName', (group: DocGroup) => {
        currentDoc.value.groupPath?.some((val) => {
            if (val.id === group.id) {
                val.title = group.title
                return true
            }
        })
    })
    eventBus.on('deleteDocGroup', (id: string) => {
        currentDoc.value.groupPath?.some((val) => {
            if (val.id === id) {
                router.push({ path: `/Editor` })
                eventBus.emit('updateTopDoc')
                return true
            }
        })
    })
    await nextTick()
})

onBeforeUnmount(() => {
    eventBus.offAll('updateGroupName')
    eventBus.offAll('deleteDocGroup')
})

watch(() => props.id, (newId: string) => {
    getSetCurrentDoc(newId)
})

function getSetCurrentDoc(docId: string) {
    if (!docId) {
        return
    }
    const msg = message.loading('获取文档...')
    getDoc(docId).then(resp => {
        const doc = resp.data as Doc
        currentDoc.value = { ...doc }
        isTop.value = doc.isTop as number == 1
        isPin.value = doc.isPin as number == 1
        readOnly.value = doc.readOnly as number == 1
    }).then(() => {
        msg.destroy()
    }).catch(err => {
        message.error(err)
    })
}

</script>



<style scoped lang='scss'>
.edit-box {
    padding: 5px 0 0 5px;
    height: 100%;
    width: 100%;

    .edit-banner {
        height: 25px;
    }

    .empty-doc {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>