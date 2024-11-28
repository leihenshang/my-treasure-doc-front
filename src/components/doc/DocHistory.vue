<template>
    <n-modal v-model:show="show as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="min-width: 1200px;">
        <template #header>
            历史
        </template>
        <div class="dialog-container">
            <n-split direction="horizontal" style="min-height: 600px" :max="0.75" :min="0.25">
                <template #1>
                    <n-data-table :columns="columns" :data="tableRows" :pagination="pagination" :bordered="false" />
                </template>
                <template #2>
                    <div ref="vditorContainerRef"></div>
                </template>
            </n-split>
        </div>
        <template #action>
            <n-button type="primary" @click="handleOkBtn">恢复此版本</n-button>
            <n-button @click="show = false">取消</n-button>
        </template>
    </n-modal>
</template>
<script lang="ts" setup>
import { getDocHistory, getDocHistoryList } from '@/api/doc/doc_history';
import { DocHistory } from '@/types/resource';
import { NButton, useMessage } from 'naive-ui';
import Vditor from 'vditor';
import "vditor/dist/index.css";
import { h, onUpdated, ref, useTemplateRef } from 'vue';

const vditorContainerRef = useTemplateRef('vditorContainerRef')
const message = useMessage()
const pagination = false
const show = defineModel('show')
const docId = defineModel('docId')
const tableRows = ref<Array<rowData>>([])
const currentDocHistory = ref<DocHistory>()
const selectedId = ref<number>()

interface rowData {
    id: number,
    createdAt: string,
}

const columns = [
    {
        title: 'ID',
        key: 'id'
    },
    {
        title: '日期',
        key: 'createdAt'
    },
    {
        title: 'Action',
        key: 'actions',
        render(row: rowData) {
            return h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: () => {
                        const msgLoading = message.loading('加载历史...')
                        Vditor.preview(vditorContainerRef.value as HTMLDivElement, '', { mode: "dark" })
                        getDocHistory(row.id).then(resp => {
                            currentDocHistory.value = resp.data as DocHistory
                            Vditor.preview(vditorContainerRef.value as HTMLDivElement, currentDocHistory.value.content, { mode: "dark" })
                            msgLoading.destroy()
                        }).catch(err => {
                            console.log(err)
                            message.error(`${err}`)
                        })

                    }
                },
                { default: () => '查看' }
            )
        }
    }
]



function handleOkBtn() {

}

onUpdated(() => {
    if (!show.value) {
        return
    }

    message.info(`onUpdated,docId:${docId.value}`)
    tableRows.value = []
    getDocHistoryList(docId.value as number).then((resp) => {
        console.log(resp.list)
        resp.list.map((val) => {
            tableRows.value.push({
                id: val.id,
                createdAt: val.createdAt as String,
            } as rowData)
        })

    }).catch(err => {
        console.log(err)
        message.error(`${err}`)
    })
})
</script>