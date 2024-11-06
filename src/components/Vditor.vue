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

watch(() => props.currentDoc, async (newDoc) => {
    if (!newDoc.isFirst) {
        vditorContainer.value?.setValue(newDoc.content)
    }

}, { deep: true })


</script>

<style scoped lang='scss'></style>