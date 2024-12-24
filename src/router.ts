import { useUserInfoStore } from "@/stores/user/user_info";
import { UserInfo } from '@/types/resource';
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
      path: '/UserManage', name: 'UserManage', component: () => import('./views/UserManage.vue'),
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

router.beforeEach(async (to) => {
  let isAuthenticated: boolean = false
  const storeUserinfo = useUserInfoStore()
  if (storeUserinfo.userId) {
    isAuthenticated = true
  } else {
    const localUserInfo: string | null = localStorage.getItem('userInfo')
    if (localUserInfo) {
      try {
        const userInfo: UserInfo = JSON.parse(localUserInfo)
        if (userInfo && userInfo.id) {
          storeUserinfo.updateUserInfo(userInfo)
          isAuthenticated = true
        }
      } catch (err) {
        console.log("failed to parse userinfo from local storage", err)
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

