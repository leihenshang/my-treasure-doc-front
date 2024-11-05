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
            <Vditor :currentDoc="currentDoc" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { useMessage, NIcon } from 'naive-ui';
import { useRoute } from 'vue-router';
import Vditor from '@/components/Vditor.vue';
import { ArrowBack, Refresh, Menu } from '@vicons/ionicons5'
import { Doc } from "@/types/resource"
import { createDoc, updateDoc, getDoc } from "@/api/doc"


const route = useRoute()
const currentDoc = reactive<Doc>({
    id: 0,
    title: "",
    content: "",
    groupId: Number(route.query.groupId)
})
const isFirst = ref<boolean>(false)
const message = useMessage()
const props = defineProps({
    id: String
})

function isFirstUpdate(isFirstUpdate: boolean) {
    isFirst.value = isFirstUpdate
}

function contentUpdate(docUpdate: Doc) {
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



watch(() => props.id, async (newId) => {
    if (newId as unknown as number > 0) {
        getDoc((newId as string)).then(resp => {
            const docObj = resp.data as Doc
            currentDoc.id = docObj.id
            currentDoc.title = docObj.title
            currentDoc.content = docObj.content
            currentDoc.groupId = docObj.groupId
            isFirst.value = true
        }).catch(err => {
            message.error(err)
        })
    }
})

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