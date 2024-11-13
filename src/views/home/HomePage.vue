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
      <div>{{ getModalTileByType(groupHandleType) }}</div>
    </template>
    <div class="dialog-container">
      <div class="dialog-content" v-if="groupHandleType != 'updateDoc'">
        <label>名称</label>
        <n-input v-model:value="updateModalName" type="text" placeholder="分组名称"></n-input>
      </div>
      <div class="dialog-content">
        <label>层级</label>
        <n-tree-select v-model:value="updateModalPid" clearable :options="options" :cascade="true" :show-path="true"
          :allow-checking-not-loaded="true" :on-load="handleLoadWithUpdateGroupLocation" />
      </div>
    </div>
    <template #action>
      <n-button type="primary" @click="updateModal(groupHandleType)">确定</n-button>
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
import { DocGroup, Doc } from '@/types/resource';
import { ArrowBack, Refresh, Menu, DocumentTextOutline, FolderOutline, CreateOutline } from '@vicons/ionicons5'
import { FolderAddOutlined, DashboardOutlined } from '@vicons/antd'
import { Delete24Filled } from "@vicons/fluent"
import { createDoc, updateDoc, getDoc, deleteDoc } from "@/api/doc"
import { getDocGroupTree, createGroup, deleteGroup, updateGroup as updateGroupData } from "@/api/doc_group"


const router = useRouter();
const topMenuRef = ref(null)
const message = useMessage()
const treeData = ref<Array<TreeOption>>([])
const showModal = ref(false);
const groupHandleType = ref('');
const newGroup = reactive<DocGroup>({ title: '', groupType: '', id: 0, pid: -1 });
const updateGroup = reactive<DocGroup>({ title: '', groupType: '', id: 0 });
const updateModalName = ref('')
const updateModalPid = ref(-1)
const updateModalDocId = ref(0)
const options = ref([
  {
    label: '顶层',
    key: 0,
    depth: 1,
    isLeaf: false
  }
])

function updateModal(type: string) {
  if (type === 'updateDoc') {
    if (updateModalPid.value < 0) {
      showModal.value = false
      clearModal()
      return
    }

    updateDoc({
      id: updateModalDocId.value,
      groupId: updateModalPid.value
    } as Doc).then(() => {
      showModal.value = false
      clearModal()
      refreshTree()
    }).catch(err => {
      console.log(err)
    })
  } else {
    createOrUpdateGroup()
  }
}

function clearModal() {
  updateModalName.value = ''
  updateModalPid.value = -1
  updateModalDocId.value = 0
}

//TODO: recursion update
function createOrUpdateGroup() {
  showModal.value = false;
  if (updateGroup.title !== "") {
    updateGroup.title = updateModalName.value
    if (updateModalPid.value > 0) {
      updateGroup.pid = updateModalPid.value
    }
    updateGroupData(updateGroup).then((resp) => {
      clearModal()
      if (updateGroup.pid == 0) {
        const newItem = Object.assign({}, updateGroup)
        newItem.id = resp?.getData()?.id
        treeData.value.push(buildTreeItem(newItem))
      } else {
        recursionReloadTreeNode(treeData.value, updateGroup.pid || 0)
      }
    }).catch(err => {
      message.error(err)
    })
  } else {
    newGroup.title = updateModalName.value
    if (newGroup.pid as number < 0 && updateModalPid.value > 0) {
      newGroup.pid = updateModalPid.value
    }
    createGroup(newGroup).then((resp) => {
      clearModal()
      console.log(resp)
      if (newGroup.pid == 0) {
        const newItem = Object.assign({}, newGroup)
        newItem.id = resp?.getData()?.id
        treeData.value.push(buildTreeItem(newItem))
      } else {
        recursionReloadTreeNode(treeData.value, newGroup.pid || 0)
      }
    }).catch(err => {
      message.error(err)
    })
  }

  updateGroup.title = ''
  updateGroup.pid = 0
};

function getModalTileByType(type: string): string {
  if (type === 'create') {
    return `新增分组`
  } else if (type === 'update') {
    return `编辑分组`
  } else if (type === 'updateDoc') {
    return `编辑文档`
  }
  return ''
}


const changeModal = (type: string, group?: DocGroup) => {
  groupHandleType.value = type
  updateGroup.title = group?.title || ''
  updateGroup.pid = group?.pid || -1
  if (type === 'update') {
    updateModalName.value = updateGroup?.title || ''
    updateModalPid.value = updateGroup?.pid || 0;
    showModal.value = true;
  } else if (type === 'create') {
    newGroup.title = ''
    newGroup.pid = group?.pid || 0;
    showModal.value = true;
  }
  if (type === 'updateDoc') {
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
  const title = genDocTitle()
  if (key === 'top-menu-write') {
    createDoc({
      id: 0,
      content: `# ${title}`,
      title: title
    } as Doc).then(res => {
      const doc = res.getData()
      treeData.value.push(buildTreeItem({
        id: doc.id,
        title: doc.title,
        groupType: "doc",
      } as DocGroup))
      router.push({ path: `/Editor/${doc.id}` })
    }).catch(err => {
      message.error(err)
    })
  }

  if (key === 'login-out') {
    myHttp.post({ url: '/api/user/logout', data: {} }).then(() => {
      localStorage.removeItem('userInfo')
      router.push("/LogIn")
    })
  }

  if (key === 'top-menu-folder') {
    changeModal('create', {
      id: 0,
      title: "",
      groupType: "",
    })
  }
}

function genDocTitle(suffix: string = "-速记") {
  const today = new Date()
  let todayTitleStr = "".concat(
    today.getFullYear().toString(),
    (today.getMonth() + 1).toString().padStart(2, '0'),
    today.getDate().toString().padStart(2, '0'),
    '.',
    today.getHours().toString().padStart(2, '0'),
    today.getMinutes().toString().padStart(2, '0'),
    today.getSeconds().toString().padStart(2, '0')) + suffix
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
      treeData.value.push(buildTreeItem(e))
    }
  }).catch((err) => {
    message.error(err)
  })
}

function buildTreeItem(d: DocGroup) {
  return {
    label: genTreeLab(d),
    key: d.id,
    isLeaf: docIsLeaf(d.groupType),
    groupType: d.groupType,
    prefix: () => getPrefixIcon(d.groupType),
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
    getDocGroupTree(node.key as number, true).then((response) => {
      if (!response.data) {
        reject()
        return
      }

      let arr: any = new Array<any>((response.data as Array<DocGroup>).length)
      for (const e of response.data as Array<DocGroup>) {
        arr.push(buildTreeItem(e))
      }
      node.children = arr
      resolve()
    }).catch((err) => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
}

function handleLoadWithUpdateGroupLocation(node: TreeOption) {
  return new Promise<void>((resolve) => {
    getDocGroupTree(node.key as number, false).then((response) => {
      if (!response.data) {
        node.children = []
        resolve()
        return
      }

      let arr: any = new Array<any>((response.data as Array<DocGroup>).length)
      for (const e of response.data as Array<DocGroup>) {
        arr.push(buildTreeItem(e))
      }
      node.children = arr
      resolve()
    }).catch((err) => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
}

function genTreeLab(group: DocGroup): string {
  return group.title
}

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      if (option.groupType == "doc") {
        router.push({ path: `/Editor/${option.key}` })
      }
    },
  }
}

const treeNodeSuffix = (info: { option: TreeOption, checked: boolean, selected: boolean }) => {
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
            show: (info.option.groupType != "doc")
          },
          {
            icon: () => { return h(NIcon, null, { default: () => h(FolderAddOutlined) }) },
            label: '编辑目录',
            key: 'updateGroup',
            show: (info.option.groupType != "doc")
          },
          {
            icon: () => { return h(NIcon, null, { default: () => h(Pen) }) },
            label: '编辑',
            key: 'updateDoc',
            show: (info.option.groupType === "doc")
          },
        ],
        onSelect: (key: string) => {
          if (key === 'delete') {
            recursionDeleteTreeNode(treeData.value, info.option.key as number)
          }
          if (key === 'createFolder') {
            changeModal('create', {
              id: 0,
              groupType: '',
              pid: info.option.key
            } as DocGroup)
          }

          if (key === 'updateGroup') {
            changeModal('update', {
              id: info.option.key,
              title: info.option.label,
              groupType: '',
              pid: info.option.pid
            } as DocGroup)
          }

          if (key === 'updateDoc') {
            updateModalDocId.value = info.option.key as number
            changeModal('updateDoc')
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
    ),
    // the add document button on the tree
    info.option.groupType != "doc" && h(
      NButton,
      {
        text: true,
        size: 'tiny',
        type: "default",
        onClick: e => {
          e.stopPropagation()
          const title = genDocTitle()
          const newDoc: Doc = {
            id: 0,
            content: `# ${title}`,
            title: title,
            groupId: info.option.key as unknown as number
          }
          createDoc(newDoc).then(res => {
            const doc = res.getData()
            if (doc.groupId === 0) {
              treeData.value.push(buildTreeItem({
                id: doc.id,
                title: doc.title,
                groupType: "doc",
              } as DocGroup))
            } else {
              recursionReloadTreeNode(treeData.value, doc.groupId || 0)
            }
            router.push({ path: `/Editor/${doc.id}` })
          }).catch(err => {
            console.log(err)
            message.error(err)
          })
        }
      },
      { icon: () => h(NIcon, null, { default: () => h(AddCircleOutline) }) }
    ),
  ])
}

function deleteTreeNode(id: number, type: string) {
  console.log(arguments)
  if (type === 'doc') {
    deleteDoc({ id } as Doc).then(() => { message.success('删除成功') }).catch(err => { console.log(err) })
  } else {
    deleteGroup({ id } as DocGroup).then(() => { message.success('删除成功') }).catch(err => { console.log(err) })
  }
}

function recursionDeleteTreeNode(arr: Array<TreeOption>, key: number) {
  if (arr.length <= 0 || key <= 0) {
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.key && arr[i].key == key) {
      deleteTreeNode(arr[i].key as number, arr[i].groupType as string)
      arr.splice(i, 1)
      router.push({ path: `/Editor/0` })
      break
    }
    recursionDeleteTreeNode(arr[i]?.children || [], key)
  }
}

function recursionReloadTreeNode(arr: Array<TreeOption>, key: number) {
  if (arr.length <= 0 || key <= 0) {
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.key && arr[i].key == key) {
      handleLoad(arr[i])
      break
    }
    recursionReloadTreeNode(arr[i]?.children || [], key)
  }
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

.dialog-container {

  .dialog-content {
    margin-bottom: 5px;

    >label {
      display: inline-flex;
      margin-bottom: 4px;
    }
  }
}
</style>