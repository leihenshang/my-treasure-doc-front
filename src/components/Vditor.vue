<template>
    <div id="vditor-container"></div>
</template>
<script lang="ts" setup>
import Vditor from 'vditor'
import "vditor/dist/index.css"
import { ref, nextTick, reactive } from "vue"
import { onMounted, watch } from "vue"
import { useMessage } from "naive-ui"
import { Doc } from "@/types/resource"

const props = defineProps<{
    currentDoc: Doc
}>()

const vditorContainer = ref()
const message = useMessage()

const emit = defineEmits<{
    (e: 'updateDoc', updateDoc: Doc): void
}>()

const currentDoc = reactive({ ...props.currentDoc })

onMounted(() => {
    message.loading("编辑器初始化")
    vditorContainer.value = new Vditor("vditor-container", {
        theme: "classic",
        minHeight: 800,
        toolbarConfig: {
            pin: true,
        },
        after: () => {
            message.destroyAll()
            vditorContainer.value.setValue(props.currentDoc.content)
            vditorContainer.value.focus()
        },
        input(md) {
            currentDoc.content = md
            let newTitle: string = getMarkdownH1Text(currentDoc.content)
            currentDoc.title = newTitle ?? currentDoc.title
            currentDoc.isFirst = false
            emit("updateDoc", currentDoc)
        },
        upload: {
            url: "api/file/upload",
            setHeaders() {
                return { "XToken": "1" }
            },
        }
    })

})

function getMarkdownH1Text(markdownContent: string): string {
    const h1Regex = /^#\s*(.*)$/gm;
    const match = h1Regex.exec(markdownContent);
    if (match && match.length > 1) {
        return match[1].trim();
    }

    return "";
}

watch(() => props.currentDoc, async (newDoc) => {
    if (!newDoc.isFirst) {
        vditorContainer.value?.setValue(newDoc.content)
    }

}, { deep: true })


</script>

<style scoped lang='scss'></style>