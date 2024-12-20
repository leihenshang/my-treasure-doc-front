<template>
    <n-modal v-model:show="showModal as boolean" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
        :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            {{ modalTitle }}
        </template>
        <div class="log-in-wrap">
            <n-form :model="userInfo" ref="formRef" label-placement="left" class="long-in-form" size="large">
                <n-form-item path="account" :rule="getRules('账号')">
                    <n-input v-model:value="userInfo.account" autofocus clearable placeholder="用户名"
                        ref="usernameInput" />
                </n-form-item>
                <n-form-item path="account" :rule="getRules('邮箱')">
                    <n-input v-model:value="userInfo.account" autofocus clearable placeholder="用户名"
                        ref="usernameInput" />
                </n-form-item>
                <n-form-item path="password" :rule="getRules('密码')">
                    <n-input v-model:value="userInfo.password" type="password" clearable placeholder="密码" />
                </n-form-item>
                <n-form-item path="password" :rule="getRules('确认密码')">
                    <n-input v-model:value="userInfo.password" type="password" clearable placeholder="确认密码" />
                </n-form-item>
                <n-form-item class="buttons-wrapper">
                    <div class="buttons">
                        <n-button default attr-type="button" @click="longIn">确认</n-button>
                        <n-button attr-type="button" @click="longIn">取消</n-button>
                    </div>
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
import { useUserInfoStore } from "@/stores/user/user_info";
import { LoginUser } from '@/types/resource';
import { FormInst, NInput, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const router = useRouter()
const storeUserInfo = useUserInfoStore()
const userInfo = ref<LoginUser>({
    id: '',
    account: '',
    password: '',
    verifyCode: '123456'
});
const usernameInput = ref<InstanceType<typeof NInput> | null>(null)
const showModal = defineModel('showModal')
const modalTitle = ref('新建用户')


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
    return { required: true, trigger: ['blur', 'input'], message: '请输入' + name }
}

</script>

<style scoped lang='scss'></style>