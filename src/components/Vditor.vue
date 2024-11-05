<template>
    <div id="vditor-container"></div>
</template>
<script lang="ts" setup>
import Vditor from 'vditor'
import "vditor/dist/index.css"
import { onMounted, watch } from "vue"
import { Doc } from "@/types/resource"

const props = defineProps<{
    doc: Doc
}>()

let vditor: Vditor
onMounted(() => {
    vditor = new Vditor("vditor-container", {
        theme: "classic",
        minHeight: 800,
        toolbarConfig: {
            pin: true,
        },
        after: () => {
            vditor.setValue(props.doc.content)
        },
    })
})

watch(() => props.doc, (newDoc) => {
    vditor?.setValue(newDoc.content)
}, { deep: true })


</script>

<style scoped lang='scss'></style>