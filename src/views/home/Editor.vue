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
            <CherryMarkdown :doc="docInstance" @update="contentUpdate">
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
const message = useMessage()
const props = defineProps({
    id: String
})


function contentUpdate(docUpdate: Doc) {
    docInstance.content = docUpdate.content
    docInstance.title = docUpdate.title

    if (docInstance.id > 0) {
        updateDoc(docInstance).catch(err => {
            message.error(err)
        })
    } else if (docUpdate.title.length > 0) {
        createDoc(docInstance).then(res => {
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
    if (!newId) {
        return
    }
    message.info("get doc " + newId)
    getDoc((newId as string)).then(resp => {
        const docObj = resp.data as Doc
        docInstance.id = docObj.id
        docInstance.title = docObj.title
        docInstance.content = docObj.content
        docInstance.groupId = docObj.groupId
    }).catch(err => {
        message.error(err)
    })
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