<template>
    <div class="user-manage">
        <n-grid :cols="2">
            <n-form-item-gi>
                <n-button @click.prevent="router.push({ path: '/Editor' })">
                    文档 <template #icon>
                        <n-icon>
                            <ArrowBackCircleSharp></ArrowBackCircleSharp>
                        </n-icon>
                    </template>
                </n-button>
            </n-form-item-gi>
            <n-form-item-gi>
                <n-button @click.prevent="currentUserId = 0; showModal = !showModal;">
                    <template #icon>
                        <n-icon>
                            <Bookmarks></Bookmarks>
                        </n-icon>
                    </template>
                    新建用户</n-button>
            </n-form-item-gi>
        </n-grid>
        <div class="table-container">
            <n-config-provider>
                <n-data-table :columns="columns" :data="tableRows" :pagination="pagination" :bordered="false"
                    :loading="loading" remote style="height:580px" size="small" />
            </n-config-provider>
        </div>
    </div>

</template>
<script setup lang="ts">
import { getUserInfoList } from '@/api/user/user_manage';
import { UserInfo } from '@/types/resource';
import { PaginationWithSort } from '@/types/treasure_response';
import { AddCircleOutline, ArrowBackCircleSharp, Bookmarks } from '@vicons/ionicons5';
import { NButton, NButtonGroup, NIcon, PaginationProps, useMessage } from 'naive-ui';
import { h, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter()
const message = useMessage()
const pagination = reactive({
    page: 1,
    pageSize: 10,
    pageCount: 1,
    itemCount: 0,
    prefix: () => {
        return '共 ' + pagination.itemCount + ' 项';
    },
    onChange: page => {
        pagination.page = page;
        getTableRows(pagination.page)
    }
} as PaginationProps)
const loading = ref(true)
const tableRows = ref<Array<UserInfo>>([])
const currentUserId = ref('')
const showModal = ref(false)

onMounted(() => {
    getTableRows(1)
})


const columns = [
    {
        title: 'ID',
        key: 'id'
    },



    {
        title: '昵称',
        key: 'nickname'
    },
    {
        title: '账号',
        key: 'account'
    },
    {
        title: '邮箱',
        key: 'email'
    },
    {
        title: '用户类型',
        key: 'userType',
        render: (val: UserInfo): string => {
            switch (val.userType) {
                case 1:
                    return '普通用户'
                case 100:
                    return '超级管理员'
                default:
                    return '未找到'
            }
        }
    },
    {
        title: '用户状态',
        key: 'userStatus',
        render: (val: UserInfo): string => {
            switch (val.userStatus) {
                case 1:
                    return '可用'
                case 2:
                    return '无效'
                case 3:
                    return '不活跃'
                default:
                    return '未找到'
            }
        }
    },
    // {
    //     title: '手机号',
    //     key: 'mobile'
    // },
    // {
    //     title: '个人说明',
    //     key: 'bio'
    // },
    {
        title: '创建日期',
        key: 'createdAt'
    },
    {
        title: '操作',
        key: 'actions',
        render(row: UserInfo) {
            return h(NButtonGroup, {
                size: "tiny",
            },
                () => [
                    h(
                        NButton,
                        {
                            text: false,
                            onClick: e => {
                                e.preventDefault()
                                e.stopPropagation()
                            },
                        },
                        { icon: () => h(NIcon, null, { default: () => h(AddCircleOutline) }), default: () => '详情' }
                    ),
                    h(
                        NButton,
                        {
                            text: false,
                            onClick: e => {
                                e.preventDefault()
                                e.stopPropagation()
                            },
                        },
                        { icon: () => h(NIcon, null, { default: () => h(AddCircleOutline) }), default: () => '删除' }
                    ),
                    h(
                        NButton,
                        {
                            text: false,
                            onClick: e => {
                                e.preventDefault()
                                e.stopPropagation()
                            },
                        },
                        { icon: () => h(NIcon, null, { default: () => h(AddCircleOutline) }), default: () => '重置密码' }
                    )
                ]
            )
        }
    }
]




function getTableRows(currentPage: number) {
    loading.value = !loading.value
    tableRows.value = []
    getUserInfoList({
        page: currentPage,
        pageSize: pagination.pageSize,
        orderBy: `createdAt_desc`,
    } as PaginationWithSort).then((resp) => {
        pagination.page = resp.pagination?.page || 0
        pagination.pageSize = resp.pagination?.pageSize || 0
        pagination.itemCount = resp.pagination?.total || 0
        pagination.pageCount = Math.ceil(pagination.itemCount / pagination.pageSize)
        resp.list.map((val) => {
            tableRows.value.push(val)
        })
        loading.value = false
    }).catch(err => {
        console.log(err)
        message.error(`${err}`)
    })
}

</script>
<style scoped lang='scss'>
.user-manage {
    padding: 10px;

    a {
        text-decoration: none;
        color: inherit;

        &:hover {
            border-bottom: 1px solid;
            cursor: pointer;
        }
    }

}
</style>