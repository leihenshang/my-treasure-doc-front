<template>
    <n-modal v-model:show="show as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="min-width: 1200px;">
        <template #header>
            历史
        </template>
        <div class="dialog-container">

            <n-split direction="horizontal" style="min-height: 600px" :max="0.75" :min="0.25">
                <template #1>
                    <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="false" />
                </template>
                <template #2>
                    <div id="vditor-container1" ref="vditorContainerRef" style="height: 100%;width: auto;"></div>
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
import type { DataTableColumns } from 'naive-ui';
import { NButton, useMessage } from 'naive-ui';
import "vditor/dist/index.css";
import { h, onMounted, ref } from 'vue';

const vditorContainerRef = ref()
const message = useMessage()

interface Song {
    no: number
    title: string
    length: string
}

function createColumns({
    play
}: {
    play: (row: Song) => void
}): DataTableColumns<Song> {
    return [
        {
            title: 'No',
            key: 'no'
        },
        {
            title: 'Title',
            key: 'title'
        },
        {
            title: 'Length',
            key: 'length'
        },
        {
            title: 'Action',
            key: 'actions',
            render(row) {
                return h(
                    NButton,
                    {
                        strong: true,
                        tertiary: true,
                        size: 'small',
                        onClick: () => play(row)
                    },
                    { default: () => 'Play' }
                )
            }
        }
    ]
}

const data: Song[] = [
    { no: 3, title: 'Wonderwall', length: '4:18' },
    { no: 4, title: 'Don\'t Look Back in Anger', length: '4:48' },
    { no: 12, title: 'Champagne Supernova', length: '7:27' }
]

const columns = createColumns({
    play(row: Song) {
        message.info(`Play ${row.title}`)
    }
})

const pagination = false as const

const show = defineModel('show')

function handleOkBtn() {

}

const vditorContainer = ref()

onMounted(() => {

})
</script>