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
            <CherryMarkdown :content="docInstance.content" @update="contentUpdate"></CherryMarkdown>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useMessage, NIcon } from 'naive-ui';
import { useRoute } from 'vue-router';
import CherryMarkdown from '@/components/CherryMarkdown.vue';
import { ArrowBack, Refresh, Menu } from '@vicons/ionicons5'
import { Doc } from "@/types/resource"
import { createDoc, updateDoc } from "@/api/doc"


const route = useRoute()
const docInstance = ref<Doc>({
    id: 0,
    title: getDefaultTitle(),
    content: `# ${getDefaultTitle()}`,
    groupId: Number(route.query.groupId)
})
const message = useMessage()


function contentUpdate(docUpdate: Doc) {
    docInstance.value.content = docUpdate.content
    docInstance.value.title = docUpdate.title
}


function getDefaultTitle(suffix: string = "-速记") {
    const today = new Date()
    let todayTitleStr = "".concat(
        today.getFullYear().toString(),
        (today.getMonth() + 1).toString().padStart(2, '0'),
        today.getDate().toString()) + suffix
    return todayTitleStr
}

watch(docInstance, async (newDoc) => {
    if (newDoc.id > 0) {
        // message.info(JSON.stringify(newDoc))
        await updateDoc(newDoc).catch(err => {
            message.error(err)
        })
    } else {
        await createDoc(newDoc).then(res => {
            docInstance.value.id = res.getData().id
        }).catch(err => {
            message.error(err)
        })

    }
}, { deep: true, immediate: true })

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