<template>
    <div id="vditor-container"></div>
</template>
<script lang="ts" setup>
import { PATH_URL } from '@/api/service'
import { darkTheme, lightTheme } from '@/constants'
import { useGlobalStore } from "@/stores/global"
import { useUserInfoStore } from "@/stores/user/user_info"
import { vditorCustomerTheme } from '@/types/editor'
import { Doc } from "@/types/resource"
import eventBus from '@/utils/event_bus'
import { useMessage } from "naive-ui"
import { default as IOptions, default as Vditor } from 'vditor'
import "vditor/dist/index.css"
import { onMounted, reactive, ref, watch } from "vue"


const props = defineProps<{ doc: Doc }>()
const storeUserInfo = useUserInfoStore()
const storeGlobal = useGlobalStore()
const vditorContainer = ref()
const message = useMessage()
const currentDoc = reactive({ ...props.doc } as Doc)
const vditorTheme = ref<vditorCustomerTheme>()


const emit = defineEmits<{
    (e: 'updateDoc', updateDoc: Doc): void
}>()

onMounted(() => {
    const msg = message.loading("初始化...")

    if (storeGlobal.theme === 'light') {
        vditorTheme.value = { ...lightTheme }
    } else {
        vditorTheme.value = { ...darkTheme }
    }

    const vditorConf = {
        theme: vditorTheme.value.editorTheme,
        height: 'calc( 100vh - 25px )',
        typewriterMode: true,
        toolbarConfig: {
            pin: true,
        },
        counter: {
            enable: true,
            type: 'text',
        },
        outline: {
            enable: false,
            position: 'right',
        },
        preview: {
            theme: { current: vditorTheme.value.previewTheme },
            hljs: {
                style: vditorTheme.value.codeTheme
            },
            markdown: {
                toc: true,
                mark: true,
                footnotes: true,
                autoSpace: true,
            },

        },
        mode: 'wysiwyg',
        placeholder: '在这里写下你的第一行文字吧！',
        after: () => {
            if (props.doc && props.doc.content && props.doc.content.length > 0) {
                vditorContainer.value?.setValue(props.doc.content)
            }

            watch(() => props.doc, (newDoc) => {
                if (newDoc.deletedAt != '') {
                    vditorContainer.value.disabled()
                }
                if (newDoc.deletedAt === null) {
                    if (newDoc.readOnly === 1) {
                        vditorContainer.value.disabled()
                    } else {
                        vditorContainer.value.enable()
                    }
                }
                vditorContainer.value?.setValue(newDoc.content)
            })

            eventBus.on('updateReadOnly', (readOnly: boolean) => {
                if (readOnly) {
                    vditorContainer.value.disabled()
                } else {
                    vditorContainer.value.enable()
                }
            })
            storeGlobal.$subscribe((mutation, state) => {
                if (state.theme === 'light') {
                    vditorContainer.value.setTheme(lightTheme.editorTheme, lightTheme.previewTheme, lightTheme.codeTheme)
                } else {
                    vditorContainer.value.setTheme(darkTheme.editorTheme, darkTheme.previewTheme, darkTheme.codeTheme)
                }
            })
            msg.destroy()
        },
        cache: {
            enable: false
        },
        input(md: string) {
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
            url: `${PATH_URL}/api/file/upload`,
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
            error(msg: string) {
                message.error(`${msg}`)
            },
        },
    }

    vditorContainer.value = new Vditor("vditor-container", vditorConf as unknown as IOptions)
})

function getMarkdownH1Text(markdownContent: string): string {
    const h1Regex = /^#\s*(.*)$/gm;
    const match = h1Regex.exec(markdownContent);
    if (match && match.length > 1) {
        return match[1].trim();
    }
    return "";
}
</script>

<style scoped lang='scss'></style>