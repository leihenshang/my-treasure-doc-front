<template>
    <div class="edit-box">
        <div class="edit-banner">
            <n-icon size="20">
                <Menu />
            </n-icon>
            <n-icon size="20">
                <ArrowBack />
            </n-icon>
            <n-icon size="20">
                <Refresh />
            </n-icon>
            <span>一个标题占位符号</span>
        </div>
        <div class="edit-content">
            <CherryMarkdown :doc="docInstance" :is-first="isFirst" @update="contentUpdate"
                @update-is-first="isFirstUpdate">
            </CherryMarkdown>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { useMessage, NIcon } from 'naive-ui';
import { useRoute } from 'vue-router';
import CherryMarkdown from '@/components/CherryMarkdown.vue';
import { ArrowBack, Refresh, Menu } from '@vicons/ionicons5'
import { Doc } from "@/types/resource"
import { createDoc, updateDoc, getDoc } from "@/api/doc"


const route = useRoute()
const docInstance = reactive<Doc>({
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
    const newDoc = { ...docInstance }
    newDoc.content = docUpdate.content
    newDoc.title = docUpdate.title
    if (newDoc.id > 0) {
        updateDoc(newDoc).catch(err => {
            message.error(err)
        })
    } else if (docUpdate.title.length > 0) {
        createDoc(newDoc).then(res => {
            docInstance.id = res.getData().id
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
    message.info(`get doc id [${newId}] in Editor page`)
    if (newId as unknown as number > 0) {
        getDoc((newId as string)).then(resp => {
            const docObj = resp.data as Doc
            docInstance.id = docObj.id
            docInstance.title = docObj.title
            docInstance.content = docObj.content
            docInstance.groupId = docObj.groupId
            isFirst.value = true
            message.info(`isFirst is:${isFirst.value}`)
        }).catch(err => {
            message.error(err)
        })
    } else {
        // docInstance.id = 0
        // docInstance.title = ""
        // docInstance.content = ""
        // docInstance.groupId = 0
    }


})

</script>



<style scoped lang='scss'>
.edit-box {
    padding: 5px 5px;
    height: 100%;

    .edit-banner {
        border: 1px dashed rgb(176, 170, 170);
        margin-bottom: 10px;
        height: 26px;
        line-height: 26px;
    }

    .edit-content {
        border: 1px dashed rgb(176, 170, 170);
        height: 100%;
    }
}
</style>