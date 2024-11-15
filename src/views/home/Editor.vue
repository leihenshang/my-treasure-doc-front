<template>
    <div class="edit-box">
        <template v-if="props.id as number > 0">
            {{ vnode }}
            <div class="edit-banner">
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
                <span class="bar-title">{{ currentTitle }}</span>
            </div>
            <div class="edit-content">
                <Vditor :doc="currentDoc" @update-doc="contentUpdate" />
            </div>
        </template>
        <div v-else class="div404">
            <n-result status="404" title="没有找到它！" description="爱可能是常觉亏欠，也可能是常觉亏钱" size="huge">
                <template #footer>
                    <n-button>需要哪种？</n-button>
                </template>
            </n-result>
        </div>
    </div>

</template>
<script lang="ts" setup>
import { onMounted, ref, watch, reactive, nextTick, computed } from 'vue'
import { useMessage, NIcon } from 'naive-ui';
import Vditor from '@/components/Vditor.vue';
import { ArrowBack, Refresh, Menu } from '@vicons/ionicons5'
import { Doc } from "@/types/resource"
import { createDoc, updateDoc, getDoc } from "@/api/doc"

const props = defineProps<{
    id: number | string,
}>()

const currentDoc = reactive<Doc>({} as Doc)
const updateTitle = ref('')
const message = useMessage()

const currentTitle = computed(() => {
    return updateTitle ?? ''
})

function contentUpdate(docUpdate: Doc) {
    if (docUpdate.title.length > 0) {
        updateTitle.value = docUpdate.title
    }

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

watch(() => props.id, (newId) => {
    getSetCurrentDoc(newId as unknown as number)

})

function getSetCurrentDoc(docId: number) {
    if (docId <= 0) {
        return
    }
    getDoc(docId).then(resp => {
        const doc = resp.data as Doc
        Object.assign(currentDoc, doc)
        updateTitle.value = doc.title
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