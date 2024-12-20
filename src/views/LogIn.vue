<template>
  <n-config-provider :theme="lightTheme" abstract>
    <div class="log-in-wrap">
      <div class="img">
        <div class="my-icon">📒</div>
      </div>
      <div class="log-in">
        <h3>登陆</h3>
        <n-form :model="userInfo" ref="formRef" label-placement="left" class="long-in-form" size="large">
          <n-form-item path="account" :rule="getRules('用户名')">
            <n-input v-model:value="userInfo.account" autofocus clearable placeholder="用户名" ref="usernameInput" />
          </n-form-item>
          <n-form-item path="password" :rule="getRules('密码')">
            <n-input v-model:value="userInfo.password" type="password" clearable placeholder="密码" />
          </n-form-item>
          <n-form-item class="buttons-wrapper">
            <div class="buttons">
              <n-button default attr-type="button" @click="longIn">登录</n-button>
              <n-button attr-type="button" @click="longIn">注册</n-button>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { logIn } from '@/api/user';
import { useUserInfoStore } from "@/stores/user/user_info";
import { LoginUser, UserInfo } from '@/types/resource';
import { FormInst, lightTheme, NInput, useMessage } from 'naive-ui';
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


const longIn = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (errors) {
      return
    }

    const msg = message.loading("登录...")
    logIn(userInfo.value).then((response) => {
      if (response?.code > 0) {
        message.error("登录失败:" + response?.msg)
        localStorage.removeItem('userInfo')
        if (usernameInput.value) {
          (usernameInput.value.focus)()
        }
        return
      }


      localStorage.setItem('userInfo', JSON.stringify(response?.data))
      storeUserInfo.updateUserInfo(response?.data as UserInfo)
      msg.destroy()
      const logInMsg = message.success("登录成功")
      router.push({ name: 'HomePage' }).then(() => {
        logInMsg.destroy()
      })
    }).catch((err: Error) => {
      msg.destroy()
      console.log(err)
      message.error(`${err}`)
    })

  }).catch((err: Error) => {
    console.log(err)
  })
}

const getRules = (name: string) => {
  return { required: true, trigger: ['blur', 'input'], message: '请输入' + name }
}

</script>

<style scoped lang='scss'>
.log-in-wrap {
  display: flex;
  width: 100%;
  height: 100%;

  >.img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70%;
    background-color: #FFFFFF;

    >.my-icon {
      font-size: 30vh;
    }
  }

  >.log-in {
    width: 30%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: #ececec;

    >h3 {
      font-size: 24px;
      text-align: center;
      color: black;
    }

    >.long-in-form {
      margin-top: 16px;

      > ::v-deep(.n-form-item) {
        .n-form-item-blank {
          .buttons {
            width: 100%;
            display: flex;
            justify-content: space-between;

            button {
              width: 150px;
              background-color: #21a497;
              color: #ffffff;

              .n-button__border {
                border: none;
              }

              &:first-child {
                margin-right: 8px;
              }
            }
          }
        }

        .n-input {
          width: 320px;

          .n-input__border {
            border: 1px solid #b8bcbf;
          }
        }
      }
    }
  }
}
</style>