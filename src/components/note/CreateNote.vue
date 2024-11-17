<template>

    <n-modal v-model:show="showModal" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            a modal
        </template>
        <div class="dialog-container">
            <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" :size="size">
                <n-form-item label="类型" path="noteType">
                    <n-select v-model:value="formValue.noteType" :options="options" clearable />
                </n-form-item>
                <n-form-item label="标题" path="title">
                    <n-input v-model:value="formValue.title" placeholder="标题" />
                </n-form-item>
                <n-form-item label="内容" path="content">
                    <n-input v-model:value="formValue.content" placeholder="内容" />
                </n-form-item>
                <n-form-item>
                    <n-button attr-type="button" @click="handleValidateClick">
                        验证
                    </n-button>
                </n-form-item>
            </n-form>
        </div>
        <template #action>
            <n-button type="primary" @click="">确定</n-button>
            <n-button @click="showModal = false">取消</n-button>
        </template>
    </n-modal>


</template>
<script lang="ts" setup>
import { defineComponent, ref, watchEffect } from 'vue'
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'

const props = defineProps<{
    showCreateNote: boolean
}>()

const showModal = ref<boolean>(props.showCreateNote)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
    noteType: '',
    title: '',
    content: '',
})

watchEffect(() => {
    showModal.value = props.showCreateNote
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

function handleValidateClick(e: MouseEvent) {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            message.success('Valid')
        }
        else {
            console.log(errors)
            message.error('Invalid')
        }
    })
}

const rules = {
    title: {
        required: true,
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