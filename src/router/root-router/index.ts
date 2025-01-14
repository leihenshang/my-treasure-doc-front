export const rootRouter = [
    { path: '/', redirect: '/LogIn' },
    { path: '/LogIn', name: 'LogIn', component: () => import('@/views/LogIn.vue') },

    {
        path: '/UserManage', name: 'UserManage', component: () => import('@/views/UserManage.vue'),
    },
]
