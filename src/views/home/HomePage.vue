<template>
  <div class="homePage-wrapper">
    <n-layout has-sider class="menu-layout">
      <n-layout-sider class="menu-sider" bordered collapse-mode="width" :collapsed-width="64" :width="288"
        :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false">
        <div style="text-align:center;"> <n-button icon-placement="right" text size="large"
            @click="router.push('/Dashboard')">
            <template #icon>
              <n-icon>
                <DashboardOutlined />
              </n-icon>
            </template>
            treasure-doc
          </n-button>
        </div>
        <n-menu v-model:value="activeKey" mode="horizontal" :options="horizontalMenuOptions"
          @update:value="topMenuUpdate" :icon-size="18" ref="topMenuRef" />
        <n-tree block-line :data="treeData" :on-load="handleLoad" :node-props="nodeProps"
          :render-suffix="treeNodeSuffix" />
      </n-layout-sider>
      <n-layout class="right">
        <router-view></router-view>
      </n-layout>
    </n-layout>
  </div>
  <n-modal v-model:show="showModal" preset="dialog" title="Dialog" :show-icon="false" class="modal-dialog"
    :mask-closable=false style="position: fixed; left: 50%;transform: translateX(-50%);top: 100px">
    <template #header>
      <div>{{ groupHandleType === 'create' ? '新增分组' : '编辑分组' }}</div>
    </template>
    <div class="dialog-content">
      <label>分组名称</label>
      <n-input v-model:value="newGroup.title" type="text" placeholder="分组名称"></n-input>
    </div>
    <template #action>
      <n-button type="primary" @click="updateGroupName">确定</n-button>
      <n-button @click="showModal = false">取消</n-button>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { h, ref, Component, onMounted, reactive } from 'vue';
import {
  MenuOption, TreeOption, useMessage, NButton, NButtonGroup,
  NIcon, NDropdown, DropdownOption, NMenu, NLayout, NTree
} from 'naive-ui';
import { useRouter, RouterLink } from 'vue-router';
import {
  EllipsisHorizontalCircleOutline as EllipsisHorizontalCircle,
  Pencil as Pen,
  SearchSharp as Search,
  MailOpen,
  ArrowForwardCircleSharp,
  MenuOutline,
  AddCircleOutline
} from '@vicons/ionicons5'
import myHttp from '@/api/treasure_axios';
import { getDocGroupTree, createGroup, updateGroup as updateGroupData } from "@/api/doc_group"
import { DocGroup } from '@/types/resource';
import { ArrowBack, Refresh, Menu, DocumentTextOutline, FolderOutline, CreateOutline } from '@vicons/ionicons5'
import { FolderAddOutlined, DashboardOutlined, PlusCircleTwotone } from '@vicons/antd'
import { Delete24Filled } from "@vicons/fluent"
import { createDoc, updateDoc, getDoc, deleteDoc } from "@/api/doc"
import { Doc } from "@/types/resource"

const router = useRouter();
const topMenuRef = ref(null)
const message = useMessage()
const treeData = ref<Array<any>>([])
const showModal = ref(false);
const groupHandleType = ref('');
const newGroup = reactive<DocGroup>({ title: '', groupType: '', id: 0 });
const updateGroup = reactive<DocGroup>({ title: '', groupType: '', id: 0 });

function updateGroupName() {
  //调用保存接口后，再次调用分组接口刷新页面的分组信息
  //然后关闭弹窗
  showModal.value = false;
  if (updateGroup.title !== "") {
    updateGroup.title = newGroup.title
    updateGroup.pid = newGroup.pid
    updateGroupData(updateGroup).then(() => {
      refreshTree()
    }).catch(err => {
      message.error(err)
    })
  } else {
    createGroup(newGroup).then(() => {
      refreshTree()
    }).catch(err => {
      message.error(err)
    })
  }

};



const changeGroup = (type: string, group?: DocGroup) => {
  groupHandleType.value = type
  if (type === 'update') {
    Object.assign(updateGroup, group)
    newGroup.title = group?.title || ''
    newGroup.pid = group?.pid || 0;
    showModal.value = true;
  } else if (type === 'delete') {
    //调用删除接口后，再次调用分组接口刷新页面的分组信息
  } else if (type === 'create') {
    newGroup.title = ''
    newGroup.pid = group?.pid || 0;
    showModal.value = true;

  }
};

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const horizontalMenuOptions: MenuOption[] = [
  // {
  //   label: '',
  //   key: 'top-menu-message',
  //   icon: renderIcon(MailOpen)
  // },
  {
    label: '',
    key: 'top-menu-search',
    icon: renderIcon(Search),
  },
  {
    label: '',
    key: 'top-menu-folder',
    icon: renderIcon(FolderAddOutlined),
  },
  {
    label: '',
    key: 'top-menu-write',
    icon: renderIcon(Pen),
  },
  {
    label: '',
    key: 'top-menu-my-center',
    icon: renderIcon(EllipsisHorizontalCircle),
    children: [
      {
        label: '退出登录',
        key: 'login-out',
        icon: renderIcon(ArrowForwardCircleSharp),

      },

    ]
  }
]

function topMenuUpdate(key: string, item: MenuOption): void {
  if (key === 'top-menu-write') {
    let title: string = getDefaultTitle()
    const newDoc: Doc = {
      id: 0,
      content: `# ${title}`,
      title: title
    }
    createDoc(newDoc).then(res => {
      let doc = res.getData()
      let docGroup: DocGroup = {
        id: doc.id,
        title: doc.title,
        groupType: "doc",
      }
      treeData.value.push(newTreeItem(docGroup))
      router.push({ path: `/Editor/${res.getData().id}` })
    }).catch(err => {
      message.error(err)
    })
  }

  if (key === 'login-out') {
    myHttp.post({ url: '/api/user/logout', data: {} }).then(() => {
      router.push("/LogIn")
    })
  }

  if (key === 'top-menu-folder') {
    changeGroup('create', {
      id: 0,
      title: "",
      groupType: "",
    })
  }
}

function getDefaultTitle(suffix: string = "-速记") {
  const today = new Date()
  let todayTitleStr = "".concat(
    today.getFullYear().toString(),
    (today.getMonth() + 1).toString().padStart(2, '0'),
    today.getDate().toString()) + suffix
  return todayTitleStr
}


const activeKey = ref<string | null>(null)
const collapsed = ref(false)


onMounted(() => {
  refreshTree()
})

function refreshTree() {
  treeData.value = []
  getDocGroupTree(0, true).then((response) => {
    for (const e of response.data as Array<DocGroup>) {
      treeData.value.push(newTreeItem(e))
    }
  }).catch((err) => {
    message.error(err)
  })
}

function newTreeItem(d: DocGroup) {
  return {
    label: genTreeLab(d),
    key: d.id,
    isLeaf: docIsLeaf(d.groupType),
    id: d.id,
    groupType: d.groupType,
    // suffix: () => getSuffixIcon(d.groupType),
    prefix: () => getPrefixIcon(d.groupType),
    docItem: d,
    pid: d.pid
  }
}


function getPrefixIcon(groupType: string) {
  switch (groupType) {
    case "doc":
      return h(NIcon, { color: "#0e7a0d" }, { default: () => h(DocumentTextOutline) })
    default:
      return h(NIcon, { color: "#FCB334" }, { default: () => h(FolderOutline) })
  }
}

function docIsLeaf(groupType: string) {
  switch (groupType) {
    case "doc":
      return true
    default:
      return false
  }
}

function handleLoad(node: TreeOption) {
  return new Promise<void>((resolve, reject) => {
    getDocGroupTree(node.key as number, false).then((response) => {
      if (response?.data === null || (response?.data as Array<DocGroup>).length == 0) {
        reject()
        return
      }

      let arr: any = new Array<any>((response.data as Array<DocGroup>).length)
      for (const e of response.data as Array<DocGroup>) {
        arr.push(newTreeItem(e))
      }
      node.children = arr
      resolve()
    }).catch((err) => {

    })
  })
}

function genTreeLab(g: DocGroup): string {
  return g.title
  // if (g.groupType == "doc") {
  //   return g.title
  // }

  // return `${g.title}(${g.childrenCount})`
}

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      const docItem = (option.docItem as DocGroup)
      if (docItem.groupType == "doc") {
        router.push({ path: `/Editor/${docItem.id}` })
      }
    },
  }
}

//节点后缀渲染
const treeNodeSuffix = ({ option }: { option: TreeOption }) => {
  return h(NButtonGroup, {
    size: "tiny",
  }, () => [
    h(
      NDropdown,
      {
        options: [
          {
            icon: () => { return h(NIcon, null, { default: () => h(Delete24Filled) }) },
            label: '删除',
            key: 'delete',
          },
          {
            icon: () => { return h(NIcon, null, { default: () => h(FolderAddOutlined) }) },
            label: '创建目录',
            key: 'createFolder',
            show: (option.groupType != "doc")
          },
          {
            icon: () => { return h(NIcon, null, { default: () => h(FolderAddOutlined) }) },
            label: '编辑目录',
            key: 'updateFolder',
            show: (option.groupType != "doc")
          },
        ],
        onSelect: (key: string | number) => {
          if (key === 'delete') {
            for (let i = 0; i < treeData.value.length; i++) {
              if (treeData.value[i].key == option.key) {
                treeData.value.splice(i, 1)
                deleteDoc({ id: option.key } as Doc)
                break
              }
            }
          }
          if (key === 'createFolder') {
            changeGroup('create', {
              id: 0,
              groupType: '',
              pid: option.pid
            } as DocGroup)
          }

          if (key === 'updateFolder') {
            changeGroup('update', {
              id: option.key,
              title: option.label,
              groupType: '',
              pid: option.pid
            } as DocGroup)
          }
        }

      },
      () => h(
        NButton,
        {
          text: true,
          size: 'small',
          onClick: e => {
            e.preventDefault()
            e.stopPropagation()
          }
        },
        { icon: () => h(NIcon, null, { default: () => h(MenuOutline) }) }
      )
    ), option.groupType != "doc" && h(
      NButton,
      {
        text: true,
        size: 'tiny',
        type: "default",
        onClick: e => {
          e.stopPropagation()
          let title: string = getDefaultTitle()
          const newDoc: Doc = {
            id: 0,
            content: `# ${title}`,
            title: title,
            groupId: option.key as unknown as number
          }
          createDoc(newDoc).then(res => {
            console.log(res.getData())
            let doc = res.getData()
            let docGroup: DocGroup = {
              id: doc.id,
              title: doc.title,
              groupType: "doc",
            }
            treeData.value.push(newTreeItem(docGroup))
            router.push({ path: `/Editor/${res.getData().id}` })
          }).catch(err => {
            message.error(err)
          })
        }
      },
      { icon: () => h(NIcon, null, { default: () => h(AddCircleOutline) }) }
    ),
  ])
}

</script>


<style scoped lang='scss'>
@import "@/assets/style/helper";

.homePage-wrapper {
  height: 100%;

  .tree-button {
    padding-left: 10px;
  }

  >.menu-layout {
    height: 100%;

    .menu-sider {
      background: $menuBackground;

      .menu-menu ::v-deep(.n-menu-item.n-menu-item--selected) {
        .n-menu-item-content {

          .n-menu-item-content__icon,
          .n-menu-item-content-header {
            color: darken($mainColor, 0.5);
          }
        }

        .n-menu-item>.n-menu-item-content:hover {

          .n-menu-item-content__icon,
          .n-menu-item-content-header {
            color: darken($mainColor, 0.5);
          }
        }

      }
    }
  }
}
</style>