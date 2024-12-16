import { UserInfo } from '@/stores/user/types';
import { useUserInfoStore } from "@/stores/user/user_info";
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/LogIn' },
    { path: '/LogIn', name: 'LogIn', component: () => import('./views/LogIn.vue') },
    {
      path: '/Dashboard', name: 'Dashboard', component: () => import('./views/Dashboard.vue'),
    },
    {
      path: '/HomePage', name: 'HomePage', component: () => import('./views/home/HomePage.vue'),
      redirect: { path: '/Editor' },
      children: [
        { path: '/Start', name: 'Start', component: () => import('./views/home/Start.vue') },
        { path: '/Collection', name: 'Collection', component: () => import('./views/home/Collection.vue') },
        { path: '/Plan', name: 'Plan', component: () => import('./views/home/Plan.vue') },
        { path: '/Editor/:id?', name: 'Editor', component: () => import('./views/home/Editor.vue'), props: true },
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
      try {
        let userInfo: UserInfo = JSON.parse(localUserInfo)
        if (userInfo && userInfo.id > 0) {
          storeUserinfo.updateUserInfo(userInfo)
          isAuthenticated = true
        }
      } catch (error) {
        console.log("failed to parse userinfo from local storage")
      }
    }
  }


  if (isAuthenticated && to.name === "LogIn") {
    return { name: "HomePage" }
  }

  if (
    // 检查用户是否已登录
    !isAuthenticated &&
    // !避免无限重定向
    to.name !== 'LogIn'
  ) {
    return { name: 'LogIn' }
  }
})

export { router };

