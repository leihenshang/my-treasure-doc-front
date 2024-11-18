<template>
    <n-button @click.prevent="showModal = true;">新建</n-button>
    <n-modal v-model:show="showModal" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            a modal
        </template>
        <div class="dialog-container">
            <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" :size="size">
                <n-form-item label="标题" path="title">
                    <n-input v-model:value="formValue.title" placeholder="标题" />
                </n-form-item>
                <n-form-item label="类型" path="noteType">
                    <n-space vertical>
                        <n-radio-group v-model:value="formValue.noteType" name="radiobuttongroup1">
                            <n-radio-button v-for="op in options" :key="op.value" :value="op.value" :label="op.label" />
                        </n-radio-group>
                    </n-space>
                </n-form-item>
                <n-form-item label="内容" path="content">
                    <n-input v-model:value="formValue.content" placeholder="内容" />
                </n-form-item>
                <n-form-item label="置顶">

                </n-form-item>
            </n-form>
        </div>
        <template #action>
            <n-button type="primary" @click="noteHandler">确定</n-button>
            <n-button @click="showModal = false">取消</n-button>
        </template>
    </n-modal>


</template>
<script lang="ts" setup>
import { defineComponent, ref, watchEffect } from 'vue'
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { createNote, updateNote } from "@/api/note"
import { Note } from '@/types/resource';

const props = defineProps<{
    id: number
}>()

const emit = defineEmits<{
    (e: 'refreshList'): void
}>()

const showModal = ref<boolean>(false)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
    noteType: 'note',
    title: '',
    content: '',
})


const options = [
    {
        label: '书签',
        value: 'bookmark',
    },
    {
        label: '树洞',
        value: 'treeHole'
    },
    {
        label: '备忘',
        value: 'note'
    },
]

function noteHandler(e: MouseEvent) {
    e.preventDefault()
    handleValidateClick().then(
        () => {
            createNote({
                ...formValue.value
            } as Note).then(() => {
                showModal.value = !showModal.value
                message.success('创建成功')
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