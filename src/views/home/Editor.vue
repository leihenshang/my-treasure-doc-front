<template>
    <div class="edit-box">
        <template v-if="props.id as number > 0">
            <div class="edit-banner">
                <n-space>
                    <div class="icon-group">
                        <n-button text style="font-size: 24px" @click="globalStore.leftMenuCollapseSwitch()">
                            <n-icon size="20">
                                <Menu></Menu>
                            </n-icon>
                        </n-button>
                        <n-icon size="20">
                            <ArrowBack> </ArrowBack>
                        </n-icon>
                    </div>
                    <n-button default round size="tiny" @click="showHistoryModal = !showHistoryModal">
                        <template #icon>
                            <n-icon size="20">
                                <Refresh></Refresh>
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
                    <n-breadcrumb>
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
        <div v-else class="div404">
            <n-result status="404" title="爱是什么？" description="爱可能是常觉亏欠，也可能是常觉亏钱" size="huge">
                <template #footer>
                    <n-button>需要哪种？</n-button>
                </template>
            </n-result>
        </div>
    </div>
    <DocHistory v-model:show="showHistoryModal" v-model:doc-id="currentDoc.id"
        v-on:refresh-doc="getSetCurrentDoc(props.id as number)">
    </DocHistory>
</template>
<script lang="ts" setup>
import { createDoc, getDoc, updateDoc } from "@/api/doc";
import Vditor from '@/components/Vditor.vue';
import DocHistory from '@/components/doc/DocHistory.vue';
import { useGlobalStore } from '@/stores/global';
import { Doc } from "@/types/resource";
import eventBus from '@/utils/event_bus';
import { ArrowBack, Menu, Refresh } from '@vicons/ionicons5';
import { NIcon, useMessage } from 'naive-ui';
import { nextTick, onMounted, ref, watch } from 'vue';


const props = defineProps<{
    id: number | string,
}>()
const globalStore = useGlobalStore()
const currentDoc = ref<Doc>({ title: '' } as Doc)
const message = useMessage()
const isTop = ref(false)
const isPin = ref(false)
const showHistoryModal = ref(false)

function contentUpdate(docUpdate: Doc, onlyIsTop: boolean = false) {
    currentDoc.value.title = docUpdate.title || ''
    docUpdate.isTop = isTop.value ? 1 : 2
    docUpdate.isPin = isPin.value ? 1 : 2
    if (docUpdate.id > 0) {
        updateDoc(docUpdate).then(() => {
            if (onlyIsTop) {
                eventBus.emit('updateTopDoc')
            }
        }).catch(err => {
            message.error(err)
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
    getSetCurrentDoc(props.id as number)
    await nextTick()
})

watch(() => props.id, (newId: number | string) => {
    getSetCurrentDoc(newId as number)
})

function getSetCurrentDoc(docId: number) {
    if (docId <= 0) {
        return
    }
    getDoc(docId).then(resp => {
        const doc = resp.data as Doc
        currentDoc.value = { ...doc }
        isTop.value = doc.isTop as number == 1
        isPin.value = doc.isPin as number == 1
    }).catch(err => {
        message.error(err)
    })
}

</script>



<style scoped lang='scss'>
.edit-box {
    padding: 5px 5px;
    min-height: 800px;

    .edit-banner {
        height: 20px;
        line-height: 20px;
        margin: 5px 0 5px 0;

        .icon-group {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            overflow: hidden;

            .n-icon {
                margin: 0 5px;
            }
        }


    }

    .div404 {
        margin-top: 10%
    }
}
</style>