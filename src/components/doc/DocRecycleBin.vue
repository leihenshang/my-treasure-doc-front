<template>
  <n-modal v-model:show="show as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
    :mask-closable=false style="min-width: 1200px;">
    <template #header>
      回收站
    </template>
    <div class="dialog-container">
      <n-split direction="horizontal" style="height: 600px" :max="0.75" :min="0.25">
        <template #1>
          <div class="table-container" style="margin: 0 10px">
            <n-config-provider>
              <n-data-table :columns="columns" :data="tableRows" :pagination="pagination" :bordered="false"
                :loading="loading" remote style="height:580px" size="small" />
            </n-config-provider>
          </div>

        </template>
        <template #2>
          <div ref="vditorPreviewRef" style="margin:0 10px;height:600px"></div>
        </template>
      </n-split>
    </div>
    <template #action>
      <n-button type="primary" @click="handleOkBtn">恢复</n-button>
      <n-button @click="show = false">取消</n-button>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { getDoc, getDocList, updateDoc } from '@/api/doc';
import { darkTheme, lightTheme } from '@/constants';
import { useGlobalStore } from "@/stores/global";
import { vditorCustomerTheme } from '@/types/editor';
import { Doc } from '@/types/resource';
import { PaginationWithSort } from '@/types/treasure_response';
import { NButton, PaginationProps, useMessage } from 'naive-ui';
import Vditor from 'vditor';
import "vditor/dist/index.css";
import { h, onUpdated, reactive, ref, useTemplateRef } from 'vue';

const emit = defineEmits<{
  (e: 'refreshDoc'): void
}>()
const vditorContainerRef = useTemplateRef('vditorPreviewRef')
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
const tableRows = ref<Array<rowData>>([])
const currentDoc = ref<Doc>()
const loading = ref(true)
const vditorTheme = ref<vditorCustomerTheme>()
const storeGlobal = useGlobalStore()


interface rowData {
  id: string,
  title: string,
  createdAt: string,
}

const columns = [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: '标题',
    key: 'title'
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
            if (storeGlobal.theme === 'light') {
              vditorTheme.value = { ...lightTheme }
            } else {
              vditorTheme.value = { ...darkTheme }
            }
            const msgLoading = message.loading('加载...')
            getDoc(row.id).then(resp => {
              currentDoc.value = resp.data as Doc
              Vditor.preview(vditorContainerRef.value as HTMLDivElement, currentDoc.value.content, {
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
  if (!currentDoc.value || !currentDoc.value.id) {
    return
  }

  updateDoc({
    id: currentDoc.value.id,
    isRecover: true,
    version: currentDoc.value.version
  } as Doc).then(() => {
    show.value = false
    emit('refreshDoc')
    message.info('更新成功');
  }).catch((err) => {
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
  getDocList('', -1, true, '', {
    page: currentPage,
    pageSize: pagination.pageSize,
    orderBy: `updatedAt_desc`,
  } as PaginationWithSort).then((resp) => {
    pagination.page = resp.pagination?.page || 0
    pagination.pageSize = resp.pagination?.pageSize || 0
    pagination.itemCount = resp.pagination?.total || 0
    pagination.pageCount = Math.ceil(pagination.itemCount / pagination.pageSize)
    resp.list.map((val) => {
      tableRows.value.push({
        id: val.id,
        title: val.title,
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