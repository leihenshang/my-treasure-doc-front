<template>
  <n-modal v-model:show="showModal as boolean" preset="dialog" title="Dialog" :show-icon="false"
           :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
    <template #header>
      {{ modalTitle }}
    </template>
    <div class="log-in-wrap">
      <n-form :model="userInfo" ref="formRef" class="long-in-form" size="small">
        <n-form-item path="account" :rule="getRules('账号')" label="账号">
          <n-input v-model:value="userInfo.account" autofocus clearable placeholder="账号"
          />
        </n-form-item>
        <n-form-item path="email" :rule="getRules('邮箱')" label="邮箱">
          <n-input v-model:value="userInfo.email" autofocus clearable placeholder="邮箱"
          />
        </n-form-item>
        <n-form-item path="password" :rule="getRules('密码')" label="密码">
          <n-input v-model:value="userInfo.password" type="password" clearable placeholder="密码"/>
        </n-form-item>
        <n-form-item path="rePassword" :rule="getRules('确认密码')" label="确认密码">
          <n-input v-model:value="userInfo.rePassword" type="password" clearable placeholder="确认密码"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button default attr-type="button" @click="longIn">确认</n-button>
            <n-button attr-type="button" @click="showModal=!showModal">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
    <!-- <template #action>
        <n-button type="primary" @click="handleOkBtn">确定</n-button>
        <n-button @click="showModal = false">取消</n-button>
    </template> -->
  </n-modal>


</template>

<script lang="ts" setup>
import {LoginUser} from '@/types/resource';
import {FormInst, NInput, useMessage} from 'naive-ui';
import {ref} from 'vue';

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const userInfo = ref<LoginUser>({
  id: '',
  account: '',
  email: '',
  password: '',
  verifyCode: '123456'
});
const showModal = defineModel('showModal')
const modalTitle = ref('新增')


const longIn = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (errors) {
      return
    }


  }).catch((err: Error) => {
    console.log(err)
  })
}

const getRules = (name: string) => {
  return {required: true, trigger: ['blur', 'input'], message: '请输入' + name}
}

</script>

<style scoped lang='scss'></style>