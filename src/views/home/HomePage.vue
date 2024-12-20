<template>
  <div class="homePage-wrapper">
    <n-layout has-sider class="menu-layout">
      <n-layout-sider class="menu-sider" bordered collapse-mode="width" :collapsed-width="0" :width="'280px'"
        show-trigger="bar" :native-scrollbar="false">
        <div style="text-align:center;">
          <n-button icon-placement="right" text size="large" @click="router.push('/Dashboard')">
            <template #icon>
              <n-icon>
                <DashboardOutlined />
              </n-icon>
            </template>
            treasure-doc
          </n-button>
          <n-button text size="medium" round @click="globalStore.themeSwitch()">{{
            globalStore.theme === 'light' ? '☀️'
              : '🌙'
          }}
          </n-button>
        </div>
        <HeaderToolList></HeaderToolList>
        <n-menu mode="horizontal" :options="horizontalMenuOptions" @update:value="topMenuUpdate" :icon-size="18"
          ref="topMenuRef" />
        <n-collapse :default-expanded-names="['1', '2']" style="padding: 0 10px 0 0;">
          <n-collapse-item title="置顶文档" name="1">
            <n-tree block-line :data="topDocList" :node-props="nodeProps" :render-switcher-icon="renderSwitcherIcon"
              :selectable="false" />
          </n-collapse-item>
          <n-collapse-item title="我的文档" name="2">
            <n-tree class="tree-wrapper" :data="treeData" :on-load="handleLoad" :node-props="nodeProps"
              :render-suffix="treeNodeSuffix" :render-switcher-icon="renderSwitcherIcon" @mouseover.stop=""
              :override-default-node-click-behavior="override" :default-expanded-keys="expandedKeys"
              :selected-keys="selectedKeys" />
          </n-collapse-item>
        </n-collapse>
      </n-layout-sider>
      <n-layout-content class="right" :native-scrollbar="false" content-style="display: flex;width:100%; height:100%;">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </div>
  <CreateGroup v-model:show="showModal" v-model:update-group="updateGroup" v-model:handle-type="groupHandleType"
    @add-tree-item="addTreeItem" @recursion-reload="id => recursionReloadTreeNode(treeData, id)">
  </CreateGroup>
  <SearchBox v-model:show="showSearchBox"></SearchBox>
  <DocRecycleBin v-model:show="showRecycleBinModal" v-on:refresh-doc=" refreshDocList(); refreshTree();">
  </DocRecycleBin>
</template>

<script lang="ts" setup>
import { createDoc, deleteDoc, getDocList } from "@/api/doc";
import { deleteGroup, getDocGroupTree } from "@/api/doc_group";
import { logOut } from '@/api/user';
import DocRecycleBin from '@/components/doc/DocRecycleBin.vue';
import CreateGroup from "@/components/home_page/CreateGroup.vue";
import { useGlobalStore } from '@/stores/global';
import { Doc, DocGroup } from '@/types/resource';
import { buildTreeItem } from '@/utils/common';
import eventBus from '@/utils/event_bus';
import { DashboardOutlined, FolderAddOutlined } from '@vicons/antd';
import { Trash } from "@vicons/fa";
import { Delete24Filled } from "@vicons/fluent";
import {
  AddCircleOutline,
  ArrowForwardCircleSharp,
  ChevronForward,
  EllipsisHorizontalCircleOutline as EllipsisHorizontalCircle,
  MenuOutline,
  Pencil as Pen,
  SearchSharp as Search
} from '@vicons/ionicons5';
import type { TreeOverrideNodeClickBehavior } from 'naive-ui';
import {
  MenuOption,
  NButton, NButtonGroup,
  NDropdown,
  NIcon,
  NLayout,
  NMenu,
  NTree,
  TreeOption, useMessage
} from 'naive-ui';
import { Component, h, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderToolList from "@/components/home_page/nav/HeaderToolList.vue";

const globalStore = useGlobalStore()
const router = useRouter();
const route = useRoute()
const topMenuRef = ref(null)
const message = useMessage()
const treeData = ref<Array<TreeOption>>([])
const topDocList = ref<Array<TreeOption>>([])
const showModal = ref(false);
const showSearchBox = ref(false);
const groupHandleType = ref('');
const updateGroup = ref<DocGroup>();
const expandedKeys = ref<Array<string>>([])
const selectedKeys = ref<Array<string>>([])
const showRecycleBinModal = ref(false)
const hoverMenuId = ref()
let handleMouseOverFn: ReturnType<typeof setTimeout>


onMounted(() => {
  refreshTree();
  refreshDocList();
})

eventBus.on('updateDocTitle', (data: Doc) => {
  recursionUpdateTreeNodeTitle(treeData.value, data.id, data.title)
})

eventBus.on('updateTopDoc', () => {
  refreshDocList()
})


onBeforeUnmount(() => {
  eventBus.offAll('updateTopDoc')
  eventBus.offAll('updateDocTitle')
})

const override: TreeOverrideNodeClickBehavior = ({ option }) => {
  if (option.groupType === 'group') {
    return 'toggleExpand'
  }
  return 'default'
}
function addTreeItem(op: TreeOption) {
  let foundDoc = false
  for (let i = 0; i < treeData.value.length; i++) {
    if (treeData.value[i].groupType == 'doc') {
      foundDoc = true
      treeData.value.splice(i, 0, op)
      break;
    }
  }
  if (!foundDoc) {
    treeData.value.push(op)
  }
}


function renderSwitcherIcon() {
  return h(NIcon, null, { default: () => h(ChevronForward) })
}

const changeModal = (type: string, group?: DocGroup) => {
  showModal.value = true;
  groupHandleType.value = type
  updateGroup.value = { ...group as DocGroup }
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
      {
        label: '回收站',
        key: 'recycle-bin',
        icon: renderIcon(Trash),
      },
    ]
  }
]

function topMenuUpdate(key: string): void {
  const title = genDocTitle()
  if (key === 'top-menu-write') {
    createDoc({
      id: '',
      content: `# ${title}`,
      title: title
    } as Doc).then(res => {
      const doc = res.getData()
      router.push({ path: `/Editor/${doc.id}` })
      const option = buildTreeItem({
        id: doc.id,
        title: doc.title,
        groupType: "doc",
      } as DocGroup)
      treeData.value.push(option)
      selectedKeys.value = []
      selectedKeys.value.push(option.key as string)
    }).catch(err => {
      message.error(err)
    })
  } else if (key === 'login-out') {
    logOut().then(() => {
      router.push("/LogIn")
    }).catch((err) => {
      if (typeof err === "string") {
        message.error(err)
      } else {
        console.log(err)
      }
    })
  } else if (key === 'top-menu-folder') {
    changeModal('create', {
      id: '',
      title: "",
      groupType: "",
      isLeaf: true,
      pid: ''
    })
  } else if (key === 'top-menu-search') {
    showSearchBox.value = true
  } else if (key === 'recycle-bin') {
    showRecycleBinModal.value = true
  }
}

function genDocTitle(suffix: string = "-新") {
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

function refreshTree() {
  treeData.value = []
  getDocGroupTree(0, true).then((response) => {
    (response.data as Array<DocGroup>).map((val) => {
      treeData.value.push(buildTreeItem(val))
    })
  }).catch((err) => {
    message.error(err)
  })
}

function refreshDocList() {
  topDocList.value = []
  getDocList(-1, 1).then((response) => {
    response.list.map((val) => {
      topDocList.value.push(buildTreeItem({
        title: val.title,
        groupType: 'doc',
        id: val.id,
      }))
    })
  }).catch((err) => {
    message.error(err)
  })
}

function handleLoad(node: TreeOption) {
  return new Promise<void>((resolve, reject) => {
    getDocGroupTree(node.id as number, true).then((response) => {
      if (!response.data) {
        reject()
        return
      }
      const docGroupList = response.data as Array<DocGroup>
      const arr = new Array<TreeOption>(docGroupList.length)
      docGroupList.map((val) => {
        arr.push(buildTreeItem(val))
      })
      if (arr.length > 0) {
        node.isLeaf = false
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

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      if (option.groupType == "doc") {
        selectedKeys.value = []
        selectedKeys.value.push(option.key as string)
        router.push({ path: `/Editor/${option.id}` })
      }
    },
    onMouseover() {
      clearTimeout(handleMouseOverFn)
      hoverMenuId.value = option.id
    },
    onMouseleave() {
      handleMouseOverFn = setTimeout(() => {
        hoverMenuId.value = 0
      }, 250)
    }
  }
}

const treeNodeSuffix = (info: { option: TreeOption, checked: boolean, selected: boolean }) => {
  if (hoverMenuId.value !== info.option.id) return
  return h(NButtonGroup, {
    size: "tiny",
  }, () => [
    h(
      NDropdown,
      {
        options: [
          {
            icon: () => {
              return h(NIcon, null, { default: () => h(Delete24Filled) })
            },
            label: '删除',
            key: 'delete',
          },
          {
            icon: () => {
              return h(NIcon, null, { default: () => h(FolderAddOutlined) })
            },
            label: '创建目录',
            key: 'createFolder',
            show: (info.option.groupType != "doc")
          },
          {
            icon: () => {
              return h(NIcon, null, { default: () => h(FolderAddOutlined) })
            },
            label: '编辑目录',
            key: 'updateGroup',
            show: (info.option.groupType != "doc")
          },
          {
            icon: () => {
              return h(NIcon, null, { default: () => h(Pen) })
            },
            label: '编辑',
            key: 'updateDoc',
            show: (info.option.groupType === "doc")
          },
        ],
        onMouseover: () => {
          clearTimeout(handleMouseOverFn)
          hoverMenuId.value = info.option.id
        },
        onMouseleave() {
          hoverMenuId.value = 0
        },
        onSelect: (key: string) => {
          if (key === 'delete') {
            recursionDeleteTreeNode(treeData.value, info.option.id as number)
          }
          if (key === 'createFolder') {
            changeModal('create', {
              pid: info.option.id
            } as DocGroup)
          }

          if (key === 'updateGroup') {
            changeModal('update', {
              id: info.option.id,
              title: info.option.label,
              pid: info.option.pid
            } as DocGroup)
          }

          if (key === 'updateDoc') {
            changeModal('updateDoc', {
              id: info.option.id,
              title: info.option.label,
              pid: info.option.pid,
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
          e.preventDefault()
          const title = genDocTitle()
          const newDoc: Doc = {
            id: '',
            content: `# ${title}`,
            title: title,
            groupId: info.option.id as unknown as string
          }
          expandedKeys.value?.push(info.option.key as string)
          createDoc(newDoc).then(res => {
            const doc = res.getData()
            if (doc.groupId === '') {
              treeData.value.push(buildTreeItem({
                id: doc.id,
                title: doc.title,
                groupType: "doc",
              } as DocGroup))
            } else {
              recursionReloadTreeNode(treeData.value, doc.groupId || '')
            }
            if (doc.id) {
              selectedKeys.value = []
              selectedKeys.value.push(`doc-${doc.id}`)
              router.push({ path: `/Editor/${doc.id}` })
            }
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


function deleteTreeNode(id: string, type: string) {
  if (type === 'doc') {
    deleteDoc({ id } as Doc).then(() => {
      message.success('删除成功');
      refreshDocList();
      if (route.params.id === id) {
        router.push({ path: `/Editor` })
      }
    }).catch(err => {
      console.log(err)
    })
  } else {
    deleteGroup({ id } as DocGroup).then(() => {
      message.success('删除成功')
    }).catch(err => {
      console.log(err)
    })
  }
}

function recursionDeleteTreeNode(arr: Array<TreeOption>, key: number) {
  if (arr.length <= 0 || key <= 0) {
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id && arr[i].id == key) {
      deleteTreeNode(arr[i].id as string, arr[i].groupType as string)
      arr.splice(i, 1)
      // router.push({ path: `/Editor` })
      eventBus.emit('deleteDocGroup', key)
      break
    }
    recursionDeleteTreeNode(arr[i]?.children || [], key)
  }
}

function recursionReloadTreeNode(arr: Array<TreeOption>, key: string) {
  if (key) {
    refreshTree()
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id && arr[i].id == key) {
      handleLoad(arr[i])
      break
    }
    recursionReloadTreeNode(arr[i]?.children || [], key)
  }
}

function recursionUpdateTreeNodeTitle(arr: Array<TreeOption>, key: string, title: string) {
  if (arr.length <= 0 || !key) {
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id == key) {
      arr[i].label = title
      break
    }
    recursionUpdateTreeNodeTitle(arr[i]?.children || [], key, title)
  }
}

</script>

<style scoped lang='scss'>
@use "/src/assets/style/helper.scss";

.menu-layout {
  height: 100%;
}

.homePage-wrapper {
  height: 100%;

  .tree-wrapper {
    ::v-deep(.n-tree-node-content) {
      width: calc(100% - 72px);
    }

    ::v-deep(.n-tree-node-content__text) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
