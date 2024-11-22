<template>
    <div class="edit-box">
        <template v-if="props.id as number > 0">
            <div class="edit-banner">
                <n-space>
                    <div class="icon-group">
                        <n-icon size="20">
                            <Menu></Menu>
                        </n-icon>
                        <n-icon size="20">
                            <ArrowBack> </ArrowBack>
                        </n-icon>
                        <n-icon size="20">
                            <Refresh></Refresh>
                        </n-icon>
                    </div>
                    <n-switch v-model:value="isTop" size="small">
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
                    <span class="bar-title">{{ currentTitle }}</span>
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

</template>
<script lang="ts" setup>
import { createDoc, getDoc, updateDoc } from "@/api/doc";
import Vditor from '@/components/Vditor.vue';
import { Doc } from "@/types/resource";
import { ArrowBack, Menu, Refresh } from '@vicons/ionicons5';
import { NIcon, useMessage } from 'naive-ui';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';


const props = defineProps<{
    id: number | string,
}>()

const currentDoc = reactive<Doc>({} as Doc)
const updateTitle = ref('')
const message = useMessage()
const isTop = ref(false)

const currentTitle = computed(() => {
    return updateTitle ?? ''
})

watch(isTop, () => {
    contentUpdate(currentDoc)
})

function contentUpdate(docUpdate: Doc) {
    if (docUpdate.title.length > 0) {
        updateTitle.value = docUpdate.title
    }
    docUpdate.isTop = isTop.value ? 1 : 0
    if (docUpdate.id > 0) {
        updateDoc(docUpdate).catch(err => {
            message.error(err)
        })
    } else if (docUpdate.title.length > 0 || docUpdate.content.length > 0) {
        createDoc(docUpdate).then(res => {
            currentDoc.id = res.getData().id
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
        Object.assign(currentDoc, doc)
        updateTitle.value = doc.title
        isTop.value = doc.isTop as number > 0
    }).catch(err => {
        message.error(err)
    })
}

</script>



<style scoped lang='scss'>
.edit-box {
    padding: 5px 5px;
    height: 100%;

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

        .bar-title {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            text-align: center;
            overflow: hidden;
            margin: 0 5px;
        }
    }

    .edit-content {
        height: 100%;
        width: 100%;

    }

    .div404 {
        margin-top: 10%
    }
}
</style>