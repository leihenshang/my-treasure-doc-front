<template>
    <div class="edit-box">
        <div class="edit-banner">
            <div class="icon-group">
                <n-icon size="20">
                    <Menu />
                </n-icon>
                <n-icon size="20">
                    <ArrowBack />
                </n-icon>
                <n-icon size="20">
                    <Refresh />
                </n-icon>
            </div>
            <span class="bar-title">{{ currentDoc.title }}</span>
        </div>
        <div class="edit-content">
            <Vditor :currentDoc="currentDoc" @update-doc="contentUpdate" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, reactive, nextTick, watchEffect } from 'vue'
import { useMessage, NIcon } from 'naive-ui';
import { useRoute } from 'vue-router';
import Vditor from '@/components/Vditor.vue';
import { ArrowBack, Refresh, Menu } from '@vicons/ionicons5'
import { Doc } from "@/types/resource"
import { createDoc, updateDoc, getDoc } from "@/api/doc"

const props = defineProps({
    id: String,
})

const route = useRoute()
const currentDoc = reactive<Doc>({
    id: 0,
    title: "",
    content: "",
    groupId: Number(route.query.groupId)
})

const message = useMessage()

function contentUpdate(docUpdate: Doc) {
    currentDoc.isFirst = false
    const newDoc = { ...currentDoc }
    newDoc.content = docUpdate.content
    newDoc.title = docUpdate.title
    if (newDoc.id > 0) {
        updateDoc(newDoc).catch(err => {
            message.error(err)
        })
    } else if (docUpdate.title.length > 0) {
        createDoc(newDoc).then(res => {
            currentDoc.id = res.getData().id
        }).catch(err => {
            message.error(err)
        })

    }
}


function getDefaultTitle(suffix: string = "-速记") {
    const today = new Date()
    let todayTitleStr = "".concat(
        today.getFullYear().toString(),
        (today.getMonth() + 1).toString().padStart(2, '0'),
        today.getDate().toString()) + suffix
    return todayTitleStr
}

onMounted(() => {
    nextTick(() => {
        getSetCurrentDoc(props.id as unknown as number, true)
    })
})


watch(() => props.id, (newId) => {
    getSetCurrentDoc(newId as unknown as number, false)

})

function getSetCurrentDoc(docId: number, isFirst: boolean) {
    if (docId <= 0) {
        return
    }
    getDoc(docId).then(resp => {
        const respDoc = resp.data as Doc
        currentDoc.id = respDoc.id
        currentDoc.title = respDoc.title
        currentDoc.content = respDoc.content
        currentDoc.groupId = respDoc.groupId
        currentDoc.isFirst = isFirst
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
    }
}
</style>