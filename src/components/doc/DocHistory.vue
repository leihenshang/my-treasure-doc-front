<template>
    <n-modal v-model:show="show as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="min-width: 1200px;">
        <template #header>
            历史
        </template>
        <div class="dialog-container">
            <n-split direction="horizontal" style="height: 600px" :max="0.75" :min="0.25">
                <template #1>
                    <div class="table-container" style="margin: 0 10px">
                        <n-config-provider>
                            <n-data-table :columns="columns" :data="tableRows" :pagination="pagination"
                                :bordered="false" :loading="loading" remote style="height:580px" size="small" />
                        </n-config-provider>
                    </div>

                </template>
                <template #2>
                    <div ref="vditorContainerRef" style="margin:0 10px;height:600px"></div>
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
import { getDocHistory, getDocHistoryList, recoveryDoc } from '@/api/doc/doc_history';
import { darkTheme, lightTheme } from '@/constants';
import { useGlobalStore } from "@/stores/global";
import { vditorCustomerTheme } from '@/types/editor';
import { DocHistory } from '@/types/resource';
import { PaginationWithSort } from '@/types/treasure_response';
import { NButton, PaginationProps, useMessage } from 'naive-ui';
import Vditor from 'vditor';
import "vditor/dist/index.css";
import { h, onUpdated, reactive, ref, useTemplateRef } from 'vue';

const emit = defineEmits<{
    (e: 'refreshDoc'): void
}>()
const vditorContainerRef = useTemplateRef('vditorContainerRef')
const message = useMessage()
const pagination = reactive({
    page: 1,
    pageSize: 10,
    pageCount: 1,
    itemCount: 0,
    prefix: () => {
        return '共 ' + pagination.itemCount + ' 项';
    },
    onChange: page => {
        pagination.page = page;
        getTableRows(pagination.page)
    }
} as PaginationProps)
const show = defineModel('show')
const docId = defineModel('docId')
const tableRows = ref<Array<rowData>>([])
const currentDocHistory = ref<DocHistory>()
const loading = ref(true)
const vditorTheme = ref<vditorCustomerTheme>()
const storeGlobal = useGlobalStore()


interface rowData {
    id: string,
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
        title: '操作',
        key: 'actions',
        render(row: rowData) {
            return h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: () => {
                        const msgLoading = message.loading('加载...')
                        if (storeGlobal.theme === 'light') {
                            vditorTheme.value = { ...lightTheme }
                        } else {
                            vditorTheme.value = { ...darkTheme }
                        }
                        getDocHistory(row.id).then(resp => {
                            currentDocHistory.value = resp.data as DocHistory
                            Vditor.preview(vditorContainerRef.value as HTMLDivElement, currentDocHistory.value.content, {
                                mode: vditorTheme.value?.editorTheme as string === "dark" ? "dark" : "light",
                                hljs: {
                                    style: vditorTheme.value?.codeTheme
                                },
                                theme: { current: vditorTheme.value?.previewTheme as string },
                            })
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
    if (!currentDocHistory.value || !currentDocHistory.value.id) {
        return
    }
    recoveryDoc(currentDocHistory.value.id).then(() => {
        show.value = false
        emit('refreshDoc')
    }).catch(err => {
        console.log(err)
        message.error(`${err}`)
    })


}

onUpdated(() => {
    if (!show.value) {
        return
    }
    getTableRows(1)
})

function getTableRows(currentPage: number) {
    loading.value = !loading.value
    tableRows.value = []
    getDocHistoryList(docId.value as number, {
        page: currentPage,
        pageSize: pagination.pageSize,
        orderBy: `createdAt_desc`,
    } as PaginationWithSort).then((resp) => {
        pagination.page = resp.pagination?.page || 0
        pagination.pageSize = resp.pagination?.pageSize || 0
        pagination.itemCount = resp.pagination?.total || 0
        pagination.pageCount = Math.ceil(pagination.itemCount / pagination.pageSize)
        resp.list.map((val) => {
            tableRows.value.push({
                id: val.id,
                createdAt: val.createdAt as string,
            })
        })
        loading.value = false
    }).catch(err => {
        console.log(err)
        message.error(`${err}`)
    })
}

</script>