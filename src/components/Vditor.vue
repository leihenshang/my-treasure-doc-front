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
import { useUserInfoStore } from "@/stores/user/user_info";
import eventBus from '@/utils/event_bus'


const props = defineProps<{ doc: Doc }>()

const storeUserInfo = useUserInfoStore()
const vditorContainer = ref()
const message = useMessage()
const currentDoc = reactive({} as Doc)

const emit = defineEmits<{
    (e: 'updateDoc', updateDoc: Doc): void
}>()


onMounted(() => {
    const msg = message.loading("正在做一些准备工作~编辑器初始化...")
    vditorContainer.value = new Vditor("vditor-container", {
        theme: "classic",
        minHeight: 900,
        height: '100%-20px',
        toolbarConfig: {
            pin: true,
        },
        placeholder: '在这里写下你的第一行文字吧！',
        value: currentDoc.content,
        after: () => {
            msg.destroy()
        },
        outline: {
            enable: false,
            position: 'left'
        },
        input(md) {
            currentDoc.content = md
            currentDoc.title = getMarkdownH1Text(currentDoc.content) ?? currentDoc.title
            currentDoc.id = props.doc.id
            if (currentDoc.title.length > 0) {
                eventBus.emit('updateDocTitle', { ...currentDoc })
            }
            if (currentDoc.content.length > 0) {
                emit("updateDoc", currentDoc)
            }
        },
        upload: {
            accept: 'image/*',//规定上传的图片格式
            url: "api/file/upload",
            fieldName: 'file',
            setHeaders(): { [key: string]: string } {
                return { "X-Token": storeUserInfo.token || '' }
            },
            max: 10 * 1024 * 1024,//上传图片的大小
            format(files: File[], responseText: string): string {
                const resp = JSON.parse(responseText)
                const vditorResp = {
                    msg: "",
                    code: 0,
                    data: {
                        succMap: {}
                    }
                }

                if (!resp || resp.code > 0) {
                    message.error(`上传文件失败:${resp?.msg}`)
                    vditorResp.code = 1
                    return JSON.stringify(vditorResp)
                }
                if (files.length <= 0) {
                    vditorResp.code = 1
                    vditorResp.msg = '返回的文件为空'
                    return JSON.stringify(vditorResp)
                }

                let succ: { [key: string]: string } = {}
                succ[files[0].name] = resp.data.path
                vditorResp.data.succMap = succ
                return JSON.stringify(vditorResp)
            },
            error(msg) {
                message.error(msg)
            },
        },

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

watch(() => props.doc.content, (newContent) => {
    if (newContent.length > 0) {
        vditorContainer.value?.setValue(newContent)
    }
})


</script>

<style scoped lang='scss'></style>