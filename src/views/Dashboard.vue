<template>
    <div class="dashboard">
        <n-grid :cols="2">
            <n-form-item-gi>
                <n-button @click.prevent="router.push('/Start')">返回首页</n-button>
            </n-form-item-gi>
            <n-form-item-gi>
                <CreateNote :id="currentNoteId" @refresh-list="refreshList"> </CreateNote>
            </n-form-item-gi>
        </n-grid>
        <n-grid :cols="9" :collapsed="gridCollapsed" :collapsed-rows="gridCollapsedRows" :x-gap="12" :y-gap="8">
            <n-gi v-for="i in noteList" :key="i.id" :class="i.id % 2 ? 'green' : 'light-green'">
                <a v-if="i.noteType === 'bookmark'" :href="i.content" target="_blank">
                    <n-icon :size="iconSize">
                        <ExternalLinkSquareAlt></ExternalLinkSquareAlt>
                    </n-icon>{{ i.title }}
                </a>
                <template v-else-if="i.noteType === 'note'">
                    <n-icon :size="iconSize">
                        <StickyNote></StickyNote>
                    </n-icon>
                    <n-ellipsis style="max-width: 240px" :line-clamp="3">{{ i.content }}
                    </n-ellipsis>
                </template>
                <template v-else-if="i.noteType === 'treeHole'">
                    <n-icon :size="iconSize">
                        <TrashRestoreAlt></TrashRestoreAlt>
                    </n-icon>
                    <n-ellipsis style="max-width: 240px" :line-clamp="3">{{
                        i.content }}
                    </n-ellipsis>
                </template>
                <template v-else>{{ i.content }}</template>
            </n-gi>
        </n-grid>
    </div>

</template>
<script lang="ts" setup>
import { getNoteList } from '@/api/note';
import { router } from '@/router';
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { Note } from '@/types/resource';
import { ExternalLinkSquareAlt, StickyNote, TrashRestoreAlt } from '@vicons/fa'
import CreateNote from '@/components/note/CreateNote.vue'

const gridCollapsed = ref(false)
const gridCollapsedRows = ref(1)
const gridItemCount = ref(4)
const message = useMessage()
const noteList = ref<Note[]>()
const currentNoteId = ref(0)
const iconSize = ref(32)

onMounted(() => {
    refreshList()
})

function refreshList() {
    getNoteList().then((resp) => {
        noteList.value = resp.list
    }).catch(err => {
        message.error(err)
    })
}

</script>
<style scoped lang='scss'>
.dashboard {
    padding: 10px;

    a {
        text-decoration: none;
        color: inherit;

        &:hover {
            border-bottom: 1px solid;
            cursor: pointer;
        }
    }

}

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