<template>
    <n-modal v-model:show="show as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="min-width: 1200px;" close-on-esc>
        <template #header>
            note
        </template>
        <div ref="vditorContainerRef" style="margin:0 10px;height:600px"></div>
    </n-modal>
</template>
<script lang="ts" setup>
import { getDoc } from "@/api/doc";
import { Doc } from "@/types/resource";
import { useMessage } from 'naive-ui';
import Vditor from 'vditor';
import "vditor/dist/index.css";
import { onUpdated, useTemplateRef } from 'vue';

const vditorContainerRef = useTemplateRef('vditorContainerRef')
const show = defineModel('show')
const message = useMessage()
const docId = defineModel('docId')

onUpdated(() => {
    if (!show.value) {
        return
    }

    const msgLoading = message.loading('加载文档...')
    Vditor.preview(vditorContainerRef.value as HTMLDivElement, '', { mode: "dark" })
    getDoc(docId.value as number).then(resp => {
        const doc = resp.data as Doc
        Vditor.preview(vditorContainerRef.value as HTMLDivElement, doc.content || '', { mode: "dark" })
        msgLoading.destroy()
    }).catch(err => {
        console.log(err)
        message.error(`${err}`)
    })

})




</script>