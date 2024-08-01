<script lang="ts" setup>
import { ref, reactive, onMounted, h, nextTick, computed } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { useRouter, RouterLink } from 'vue-router';
import SvgIcon from '@/components/public/SvgIcon.vue';
import { getDocList } from "@/api/doc"
import { Doc, DocGroup } from "@/types/resource"
import { PaginationWithSort } from "@/types/treasure_response"

const groupList = ref<DocGroup[]>([{ title: '全部', id: 0 }]);


onMounted(() => {
    getDocList(0).then((res) => {
        data.value = res.list as Array<Doc>
    })
})

const columns = ref<any>([
    {
        title: 'ID',
        key: 'id',
        sorter: true,
        sortOrder: false
    },
    {
        title: '名称',
        key: 'title'
    },
    {
        title: '置顶',
        key: 'isTop'
    },
    {
        title: '创建时间',
        key: 'createdAt'
    }
])


type search = {
    data1?: string
    data2?: string
}

const router = useRouter()

const data = ref<Doc[]>([])
const loading = ref(false)
const pagination = reactive({
    itemCount: 0,
    page: 1,
    pageCount: 1,
    pageSize: 10,
    prefix({ itemCount }: { itemCount: any }) {
        return `Total is ${itemCount}.`
    }
})
const searchData = ref<search>({});
const selectedCollectionId = ref(0);

//获取右侧表格的标题
const selectedGroupName = computed(() => {
    return groupList.value.filter((item) => item.id === selectedCollectionId.value)[0]?.title;
});

function rowKey(rowData: any) {
    return rowData?.id
}


function handlePageChange(currentPage: any) {
    if (!loading.value) {
        loading.value = true
        getDocList()
    }
}


function rowProps(row: any) {
    return {
        style: 'cursor: pointer;',
        onClick: () => {
            // message.info(JSON.stringify(row))
            router.push({ path: '/Edit', query: { id: row.id } })
        }
    }
}

</script>

<template>
    <div class="my-note-wrapper">
        <div class="right">
            <div class="title">
                <h3>{{ selectedGroupName }}</h3>
                <div class="search">
                    <n-input v-model:value="searchData.data1" type="text" size="small" placeholder="搜索">
                        <template #prefix>
                            <SvgIcon icon-name="search"></SvgIcon>
                        </template>
                    </n-input>
                    <SvgIcon icon-name="filter"></SvgIcon>
                </div>
            </div>
            <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
                :row-key="rowKey" @update:page="handlePageChange" :row-props="rowProps" />
        </div>

    </div>
</template>

<style scoped lang='scss'>
$grey-color: #8A8F8D;
$grey-background: #eff0f0;

.handle-pop-select-options {
    min-width: 104px;

    >li {
        padding: 8px 16px;
        cursor: pointer;

        &:hover {
            background: $grey-background;
        }
    }
}

.my-note-wrapper {
    display: flex;
    height: 100%;

    .title {
        color: $grey-color;
        display: flex;
        justify-content: space-between;
        align-items: center;

        >.icon {
            color: #000000;
            cursor: pointer;
        }
    }


    >.right {
        width: 100%;
        padding: 10px 24px 20px;

        >.title {
            display: flex;
            color: #262626;
            padding: 10px 0;
            align-items: center;

            h3 {
                font-size: 16px;
            }

            >.search {
                display: flex;
                align-items: center;

                >.n-input {
                    background: #fafafa;

                    &::v-deep(.n-input__border),
                    &::v-deep(.n-input__state-border) {
                        display: none;
                    }

                    &.n-input--focus {
                        border: none;
                    }
                }

                >.icon {
                    color: #585A5A;
                    font-size: 18px;
                    margin-left: 4px;
                }
            }
        }
    }
}

.dialog-content {
    >label {
        display: inline-flex;
        margin-bottom: 4px;
    }
}
</style>