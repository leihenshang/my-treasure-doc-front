import { createWebHashHistory, createRouter } from 'vue-router';
import { useUserInfoStore } from "@/stores/user/userinfo";
import { UserInfo } from '@/stores/user/types'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/LogIn' },
    { path: '/LogIn', name: 'LogIn', component: () => import('./views/LogIn.vue') },
    {
      path: '/HomePage', name: 'HomePage', component: () => import('./views/home/HomePage.vue'),
      redirect: { name: 'Collection' },
      children: [
        { path: '/Collection', name: 'Collection', component: () => import('./views/home/Collection.vue') },
        { path: '/Plan', name: 'Plan', component: () => import('./views/home/Plan.vue') },
        { path: '/Editor/:id', name: 'Editor', component: () => import('./views/home/Editor.vue'), props: true },
        { path: '/Note', name: 'Note', component: () => import('./views/home/Note.vue') },
      ],
    }
  ]
})

router.beforeEach(async (to, from) => {
  let isAuthenticated: boolean = false
  const storeUserinfo = useUserInfoStore()
  if (storeUserinfo.userId > 0) {
    isAuthenticated = true
  } else {
    let localUserInfo: string | null = localStorage.getItem('userInfo')
    if (localUserInfo) {
      let userInfo: UserInfo = JSON.parse(localUserInfo)
      if (userInfo && userInfo.id > 0) {
        storeUserinfo.updateUserinfo(userInfo)
        isAuthenticated = true
      }
    }
  }

  if (
    // 检查用户是否已登录
    !isAuthenticated &&
    // !避免无限重定向
    to.name !== 'LogIn'
  ) {
    // 将用户重定向到登录页面
    return { name: 'LogIn' }
  }
})

export { router }