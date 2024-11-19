<template>
    <n-button @click.prevent="formValue = initNote; showModal = !showModal;">新建</n-button>
    <n-modal v-model:show="showModal" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            新建
        </template>
        <div class="dialog-container">
            <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" :size="size">
                <n-form-item label="类型" path="noteType">
                    <n-space vertical>
                        <n-radio-group v-model:value="formValue.noteType">
                            <n-radio-button v-for="op in options" :key="op.value" :value="op.value" :label="op.label" />
                        </n-radio-group>
                    </n-space>
                </n-form-item>
                <n-form-item label="标题" path="title" v-if="formValue.noteType == 'bookmark'">
                    <n-input v-model:value="formValue.title" placeholder="标题" />
                </n-form-item>
                <n-form-item label="内容" path="content">
                    <n-input type="textarea" v-model:value="formValue.content" placeholder="内容" />
                </n-form-item>
                <n-form-item label="置顶">
                    <n-space>
                        <n-switch :round="false" :checked-value=1 :unchecked-value=0 v-model:value="formValue.isTop" />
                    </n-space>
                </n-form-item>
            </n-form>
        </div>
        <template #action>
            <n-button type="primary" @click="handleOkBtn">确定</n-button>
            <n-button @click="showModal = !showModal">取消</n-button>
        </template>
    </n-modal>


</template>
<script lang="ts" setup>
import { defineComponent, ref, watchEffect } from 'vue'
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { createNote, updateNote, getNote } from "@/api/note"
import { Note } from '@/types/resource';

const props = defineProps<{
    id: number
}>()

const emit = defineEmits<{
    (e: 'refreshList'): void
}>()

const initNote: Note = {
    id: 0,
    noteType: 'note',
    title: '',
    content: '',
    isTop: 0
}


const showModal = ref<boolean>(false)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref<Note>({ ...initNote })



watchEffect(() => {
    if (props.id > 0) {
        getNote(props.id).then((resp) => {
            showModal.value = true
            const respNote = resp.data as Note
            formValue.value.noteType = respNote.noteType
            formValue.value.title = respNote.title
            formValue.value.content = respNote.content
            formValue.value.isTop = respNote.isTop || 0
            formValue.value.id = respNote.id
        }).catch(err => {
            message.error((typeof err) === 'string' ? err : console.log(err))
        })
    }
})


const options = [
    {
        label: '书签',
        value: 'bookmark',
    },
    // {
    //     label: '树洞',
    //     value: 'treeHole'
    // },
    {
        label: '备忘',
        value: 'note'
    },
]

function handleOkBtn(e: MouseEvent) {
    e.preventDefault()
    handleValidateClick().then(
        () => {
            const note = { ...formValue.value }
            note.isTop = note.isTop ? 1 : 0;
            if (formValue.value.id > 0) {
                updateNote(note as Note).then(() => {
                    showModal.value = !showModal.value
                    message.success('更新成功')
                    formValue.value = initNote
                    emit('refreshList')
                }).catch(err => {
                    message.error(err)
                })
                return
            }

            createNote(note as Note).then(() => {
                showModal.value = !showModal.value
                message.success('创建成功')
                formValue.value = initNote
                emit('refreshList')
            }).catch(err => {
                message.error(err)
            })
        }
    ).catch(err => {
        console.log(err)
    })
}

function handleValidateClick(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        formRef.value?.validate((errors) => {
            if (!errors) {
                resolve()
            } else {
                reject(errors)
            }
        })
    })
}

const rules = {
    title: {
        required: false,
        message: '请输入标题',
        trigger: 'blur'
    },
    content: {
        required: true,
        message: '请输入内容',
        trigger: 'blur'
    },
    noteType: {
        required: true,
        message: '请选择类型',
        trigger: 'blur'
    },
}

</script>
<style lang="scss"></style>