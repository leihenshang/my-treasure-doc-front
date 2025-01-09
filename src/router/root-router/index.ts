export const rootRouter = [
    { path: '/', redirect: '/LogIn' },
    { path: '/LogIn', name: 'LogIn', component: () => import('@/views/LogIn.vue') },
    {
        path: '/Dashboard', name: 'Dashboard', component: () => import('@/views/dash-board/DashBoard.vue'),
    },
    {
        path: '/UserManage', name: 'UserManage', component: () => import('@/views/UserManage.vue'),
    },
]
