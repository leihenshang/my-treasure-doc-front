<template>
  <n-modal v-model:show="showModal" preset="dialog" title="创建备忘" :show-icon="false"
           :mask-closable="false">
<!--    <template #header>-->
<!--      <div>创建备忘</div>-->
<!--    </template>-->
    <n-form ref="formRef" :label-width="50" :model="formValue" label-placement="left">
      <n-form-item label="类型" path="noteType" :rule="customFormRules.getRequireRule('请选择类型')">
        <n-radio-group v-model:value="formValue.noteType" name="radiogroup">
          <n-radio v-for="item in noteTypes" :value="item.type" :key="item.type">
            {{ item.name }}
          </n-radio>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input v-model:value="formValue.title" placeholder="标题"/>
      </n-form-item>
      <n-form-item label="内容" path="content" :rule="customFormRules.getRequireRule('请输入内容')">
        <n-input v-model:value="formValue.content" type="textarea" :rows="5" placeholder="内容"/>
      </n-form-item>
      <n-form-item label="置顶" path="isTop">
        <n-switch v-model:value="formValue.isTop" :checked-value="1" :unchecked-value="0"/>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button @click="showModal=false">取消</n-button>
      <n-button type="info" secondary @click="handleConfirm">确定</n-button>
    </template>
  </n-modal>
</template>

<script lang="ts">
import {ref} from "vue";
import type {FormInst} from 'naive-ui'
import type {Note} from "@/resource";
import {$_createNote} from "@/api/dashboard";
import customFormRules from "@/utils/form/form-rules"

export default {
  name: "DashboardCardDialog",
  setup(props,context) {
    const showModal = ref(false)
    const formRef = ref<FormInst | null>(null)
    const formValue = ref<Note>({})
    const noteTypes = [{name: '链接', type: 'bookmark'}, {name: '笔记', type: 'note'}, {name: '文档', type: 'doc'}]

    const showDialog = () => {
      showModal.value = true
    }
    //点击确认按钮
    const handleConfirm = () => {
      formRef.value?.validate((errors) => {
        if (errors) {return}
      })
      $_createNote(formValue.value).then(() => {
        let noteTypeName
        const noteType = formValue.value.noteType
        noteTypes.forEach((item) => {
          if (item.type === noteType) noteTypeName = item.name
        })
        context.emit('updateDashboard', {noteType,noteTypeName})
        showModal.value = false
      })
    }
    return {showModal, showDialog, formRef, noteTypes, formValue, handleConfirm,customFormRules}
  }
}

</script>

<style scoped lang="scss">

</style>
