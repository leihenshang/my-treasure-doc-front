<template>
    <div id="markdown-container">
    </div>
</template>

<script lang="ts" setup>
import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown';
import { onMounted, ref } from 'vue'
import myHttp from "@/api/treasure_axios";
import { useMessage } from 'naive-ui';
import { Doc } from "@/types/resource"
import { CherryOptions } from 'cherry-markdown/types/cherry';

let cherryInstance: Cherry
const message = useMessage()
const props = defineProps({
    content: { type: String, default: "" }
})
const emit = defineEmits<{
    (e: 'update', content: Doc): void
}>()
const content = ref<Doc>({ title: "", content: props.content!, id: 0 })

onMounted(() => {
    if (!cherryInstance) {
        cherryInstance = newEditor()
        cherryInstance.setMarkdown(content.value.content)
    }
})

function newEditor() {
    const config = {
        id: 'markdown-container',
        value: "",
        callback: {
            afterChange(mb: any, htmlVal: any) {
                content.value.title = cherryInstance.getToc().shift()?.text ?? ""
                content.value.content = mb
                emit('update', { title: content.value.title, content: content.value.content, id: 0 })
            }
        },
        fileUpload(file: File, fCallback: any) {
            console.table(file, fCallback)
            myHttp.post({ url: "api/file/upload", data: { file } }).then((response) => {
                if (response?.data?.code) {
                    message.error("上传失败:" + response?.data?.msg)
                    return
                }

                fCallback(response.data?.path)
            }).catch((err: any) => {
                message.error(err)
            })
        },
        toolbars: {
            theme: 'light'
        },
        engine: {
            syntax: {
                header: {
                    /**
                     * 标题的样式：
                     *  - default       默认样式，标题前面有锚点
                     *  - autonumber    标题前面有自增序号锚点
                     *  - none          标题没有锚点
                     */
                    anchorStyle: 'autonumber',
                },
                table: {
                    enableChart: false,
                    // chartRenderEngine: EChartsTableEngine,
                    // externals: ['echarts'],
                },
            }

        }
    }

    return new Cherry(config as unknown as CherryOptions);
}
</script>


<style lang="scss"></style>