<template>
    <n-modal v-model:show="showModal as boolean" preset="dialog" title="Dialog" :show-icon="false" :mask-closable=false
        style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
        <template #header>
            {{ modalTitle }}
        </template>
        <div class="log-in-wrap">
            <n-form :model="userInfo" ref="formRef" class="long-in-form" size="small">
                <template v-if="props.mode == 'create'">
                    <n-form-item path="account" :rule="getRules('账号')" label="账号">
                        <n-input v-model:value="userInfo.account" clearable placeholder="账号" type="text"
                            :input-props="{ autocomplete: 'off' }" autofocus />
                    </n-form-item>
                    <n-form-item path="email" :rule="getRules('邮箱')" label="邮箱">
                        <n-input v-model:value="userInfo.email" clearable placeholder="邮箱" type="text"
                            :input-props="{ autocomplete: 'off' }" />
                    </n-form-item>
                </template>
                <n-form-item path="password" :rule="getRules('密码')" label="密码">
                    <n-input v-model:value="userInfo.password" type="password" clearable placeholder="密码" />
                </n-form-item>
                <n-form-item path="rePassword" :rule="getRules('确认密码')" label="确认密码">
                    <n-input v-model:value="userInfo.rePassword" type="password" clearable placeholder="确认密码"
                        :input-props="{ autocomplete: 'off' }" />
                </n-form-item>
                <n-form-item>
                    <n-space>
                        <n-button default attr-type="button" @click="longIn">确认</n-button>
                        <n-button attr-type="button" @click="showModal = !showModal">取消</n-button>
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
import { createUserInfo, resetPwd } from "@/api/user_manage";
import { LoginUser, UserInfo } from '@/types/resource';
import { FormInst, NInput, useMessage } from 'naive-ui';
import { ref } from 'vue';


const defaultUserInfo: LoginUser = {
    id: '',
    account: '',
    email: '',
    password: '',
    rePassword: '',
    verifyCode: '123456'
}

const showModal = defineModel('showModal')
const props = defineProps<{ mode: string, user: UserInfo | undefined }>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const userInfo = ref<LoginUser>({ ...defaultUserInfo });
const modalTitle = ref(props.mode == 'create' ? '新增' : '重置密码')


const longIn = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (errors) {
            return
        }

        if (userInfo.value.password !== userInfo.value.rePassword) {
            message.error('两次的密码不一直 ')
            return
        }

        if (props.mode == 'create') {
            createUserInfo(userInfo.value).then(() => {
                message.success('成功');
                userInfo.value = { ...defaultUserInfo }
                showModal.value = !showModal.value;
            }).catch((err) => {
                console.log(err)
                message.error(err.msg)
            })

        } else if (props.mode == 'resetPwd') {
            if (props.user === undefined) {
                return
            }

            userInfo.value.account = props.user.account
            userInfo.value.id = props.user.id

            resetPwd(userInfo.value).then(() => {
                message.success('成功');
                userInfo.value = { ...defaultUserInfo }
                showModal.value = !showModal.value;
            }).catch((err) => {
                console.log(err)
                message.error(err.msg)
            })

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