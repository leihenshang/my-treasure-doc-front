<template>
    <n-grid :cols="2">
        <n-form-item-gi label="操作">
            <n-button @click="router.push('HomePage')">返回首页</n-button>
        </n-form-item-gi>
        <n-form-item-gi label="数量">
            <n-input-number v-model:value="gridItemCount" :min="1" />
        </n-form-item-gi>
    </n-grid>
    <n-grid :cols="9" :collapsed="gridCollapsed" :collapsed-rows="gridCollapsedRows">
        <n-gi v-for="i in gridItemCount" :key="i" :class="i % 2 ? 'green' : 'light-green'">
            {{ i }}
        </n-gi>
    </n-grid>
</template>
<script lang="ts" setup>
import { getNoteList } from '@/api/note';
import { router } from '@/router';
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { Note } from '@/types/resource';

const gridCollapsed = ref(false)
const gridCollapsedRows = ref(1)
const gridItemCount = ref(4)
const showSuffix = ref(true)
const message = useMessage()
const noteList = ref<Note[]>()

onMounted(() => {
    getNoteList().then((resp) => {
        noteList.value = resp.list
    }).catch(err => {
        message.error(err)
    })
})

</script>
<style scoped>
.light-green {
    height: 80px;
    background-color: rgba(0, 128, 0, 0.12);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.green {
    height: 80px;
    background-color: rgba(0, 128, 0, 0.24);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>