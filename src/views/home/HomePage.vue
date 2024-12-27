<template>
  <div class="homePage-wrapper">
    <n-layout has-sider class="menu-layout">
      <n-layout-sider class="menu-sider" bordered collapse-mode="width" :collapsed-width="0" :width="'280px'"
        show-trigger="bar" :native-scrollbar="false">
        <div class="title-header-wrapper" style="text-align:center;height: 40px">
          <h3 style="line-height: 40px"> treasure-doc</h3>
          <n-button class="theme-button" :class="{ 'HoverThemeButton': isHoverThemeButton }" text size="medium" round
            @click="globalStore.themeSwitch()" @mouseover="hoverThemeButton" @mouseleave="mouseleaveThemeButton">
            <n-icon v-if="globalStore.theme === 'light'" size="14" color="#F1DD38">
              <MoonSharp />
            </n-icon>
            <n-icon v-else size="14" color="#FFB200">
              <SunnySharp />
            </n-icon>
          </n-button>
        </div>
        <HeaderToolList :tool-list="toolMenuList" @handleClickTool="topMenuAction"></HeaderToolList>
        <n-collapse :default-expanded-names="['1', '2']" style="padding: 0 10px 0 0;">
          <n-collapse-item title="置顶文档" name="1">
            <n-tree v-show="topDocList.length > 0" block-line :data="topDocList" :node-props="nodeProps"
              :render-switcher-icon="renderSwitcherIcon" :selectable="false" />
          </n-collapse-item>
          <n-collapse-item title="我的文档" name="2">
            <n-tree class="tree-wrapper" :data="treeData" :on-load="handleLoad" :node-props="nodeProps"
              :render-suffix="treeNodeSuffix" :render-switcher-icon="renderSwitcherIcon" @mouseover.stop=""
              :override-default-node-click-behavior="override" :default-expanded-keys="expandedKeys"
              :selected-keys="selectedKeys" block-line />
          </n-collapse-item>
        </n-collapse>
      </n-layout-sider>
      <n-layout-content class="right" :native-scrollbar="false" content-style="display: flex;width:100%; height:100%;">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </div>
  <CreateGroup v-model:show="showModal" v-model:update-group="updateGroup" v-model:action-name="createGroupAction"
    @updated="updateData => handleCreateGroup(updateData)">
  </CreateGroup>
  <SearchBox v-model:show="showSearchBox"></SearchBox>
  <DocRecycleBin v-model:show="showRecycleBinModal" v-on:refresh-doc=" refreshTopDocList(); refreshTree();">
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
import { FolderAddOutlined } from '@vicons/antd';
import { Delete24Filled } from "@vicons/fluent";
import { ToolObj } from "@/home-page/nav-type";
import {
  AddCircleOutline,
  ChevronForward,
  MenuOutline,
  Pencil as Pen,
  MoonSharp,
  SunnySharp,
} from '@vicons/ionicons5';
import type { TreeOverrideNodeClickBehavior } from 'naive-ui';
import { NButton, NButtonGroup, NDropdown, NIcon, NLayout, NTree, TreeOption, useMessage } from 'naive-ui';
import { h, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderToolList from "@/components/home_page/nav/HeaderToolList.vue";
import SearchBox from "@/components/home_page/SearchBox.vue";
import { ROOT_GROUP } from "@/constants";

const globalStore = useGlobalStore()
const router = useRouter();
const route = useRoute()
const message = useMessage()
const treeData = ref<Array<TreeOption>>([])
const topDocList = ref<Array<TreeOption>>([])
const showModal = ref(false);
const showSearchBox = ref(false);
const createGroupAction = ref('');
const updateGroup = ref<DocGroup>();
const expandedKeys = ref<Array<string>>([])
const selectedKeys = ref<Array<string>>([])
const showRecycleBinModal = ref(false)
const hoverMenuId = ref()
let handleMouseOverFn: ReturnType<typeof setTimeout>
const isHoverThemeButton = ref(false)

const toolMenuList: ToolObj[] = [
  { type: 'icon', iconOrTextName: 'Search', props: 'search' },
  { type: 'icon', iconOrTextName: 'FolderOutline', props: 'addFolder' },
  { type: 'icon', iconOrTextName: 'PencilOutline', props: 'addNote' },
  {
    type: 'icon', iconOrTextName: 'EllipsisHorizontalCircleOutline', props: 'more',
    HandleSelectList: [{
      label: '退出登录',
      iconName: 'ArrowBackCircleOutline',
      props: 'logOut'
    },
    {
      label: '回收站',
      iconName: 'Delete16Regular',
      props: 'recycleBin',
      iconType: 'fluent'
    },
    {
      label: '系统管理',
      iconName: 'PeopleCircleSharp',
      props: 'userManage',
      iconType: 'ionicons'
    },
    {
      label: '仪表盘',
      iconName: 'Board24Filled',
      props: 'dashboard',
      iconType: 'fluent'
    },
    ]
  },
]



onMounted(() => {
  refreshTree();
  refreshTopDocList();
})

eventBus.on('updateDocTitle', (data: Doc) => {
  recursionUpdateTreeNodeTitle(treeData.value, data.id, data.title)
})

eventBus.on('updateGroupName', (data: TreeOption) => {
  recursionUpdateTreeNodeTitle(treeData.value, data.id as string, data.title as string)
})

eventBus.on('updateTopDoc', () => {
  refreshTopDocList()
})


onBeforeUnmount(() => {
  eventBus.offAll('updateTopDoc')
  eventBus.offAll('updateDocTitle')
  eventBus.offAll('updateDocGroupName')
})

//切换主题的位置
const hoverThemeButton = () => {
  isHoverThemeButton.value = true
}
const mouseleaveThemeButton = () => {
  isHoverThemeButton.value = false
}

const override: TreeOverrideNodeClickBehavior = ({ option }) => {
  if (option.groupType === 'group') {
    return 'toggleExpand'
  }
  return 'default'
}




function renderSwitcherIcon() {
  return h(NIcon, null, { default: () => h(ChevronForward) })
}

const changeModal = (action: string, group?: DocGroup) => {
  showModal.value = true;
  createGroupAction.value = action
  updateGroup.value = { ...group as DocGroup }
};

function topMenuAction(key: string): void {
  const title = genDocTitle()
  if (key === 'addNote') {
    createDoc({
      id: '',
      content: `# ${title}`,
      title: title,
      groupId: ROOT_GROUP
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
  } else if (key === 'logOut') {
    logOut().then(() => {
      router.push("/LogIn")
    }).catch((err) => {
      if (typeof err === "string") {
        message.error(err)
      } else {
        console.log(err)
      }
    })
  } else if (key === 'addFolder') {
    changeModal('create', {
      id: '',
      title: "",
      groupType: "",
      isLeaf: true,
      pid: ''
    })
  } else if (key === 'search') {
    showSearchBox.value = true
  } else if (key === 'recycleBin') {
    showRecycleBinModal.value = true
  } else if (key === 'userManage') {
    router.push({ path: '/UserManage' })
  } else if (key === 'dashboard') {
    router.push({ path: '/DashBoard' })
  }
}

function genDocTitle(suffix: string = "-新") {
  const today = new Date()
  return "".concat(
    today.getFullYear().toString(),
    (today.getMonth() + 1).toString().padStart(2, '0'),
    today.getDate().toString().padStart(2, '0'),
    '.',
    today.getHours().toString().padStart(2, '0'),
    today.getMinutes().toString().padStart(2, '0'),
    today.getSeconds().toString().padStart(2, '0')) + suffix
}

function refreshTree() {
  treeData.value = []
  getDocGroupTree('root', true).then((response) => {
    if (!response.data) {
      return
    }
    (response.data as Array<DocGroup>).map((val) => {
      treeData.value.push(buildTreeItem(val))
    })
  }).catch((err) => {
    console.log(err)
    message.error(err.msg)
  })
}

function refreshTopDocList() {
  topDocList.value = []
  getDocList('', 1).then((response) => {
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
    getDocGroupTree(node.id as string, true).then((response) => {
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
            const op = buildTreeItem({
              id: doc.id,
              title: doc.title,
              groupType: "doc",
            } as DocGroup)
            recursionReloadTreeNodeV1(treeData.value, 'createDoc', op)

            // if (doc.groupId === '') {
            //   treeData.value.push(op)
            // } else {
            //   recursionReloadTreeNode(treeData.value, doc.groupId || '')
            // }
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


// function recursionAddTreeNode(op: TreeOption) {
//   let foundDoc = false
//   for (let i = 0; i < treeData.value.length; i++) {
//     if (treeData.value[i].groupType == 'doc') {
//       foundDoc = true
//       treeData.value.splice(i, 0, op)
//       break;
//     }
//   }
//   if (!foundDoc) {
//     treeData.value.push(op)
//   }
// }

function recursionDeleteTreeNode(arr: Array<TreeOption>, key: number) {
  if (!arr || arr.length <= 0 || !key) {
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id == key) {
      const id = arr[i]?.id
      if ((arr[i].groupType as string) === 'doc') {
        deleteDoc({ id } as Doc).then(() => {
          message.success('删除成功');
          refreshTopDocList();
          arr.splice(i, 1)
          if (route.params.id === id) {
            router.push({ path: `/Editor` })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        deleteGroup({ id } as DocGroup).then(() => {
          message.success('删除成功')
          arr.splice(i, 1)
          eventBus.emit('deleteDocGroup', key)
        }).catch(err => {
          console.log(err)
        })
      }
      break
    }
    recursionDeleteTreeNode(arr[i]?.children || [], key)
  }
}

function handleCreateGroup(updateData: TreeOption): void {
  console.log(createGroupAction.value, updateData)
  recursionReloadTreeNodeV1(treeData.value, createGroupAction.value, updateData)
  // if (createGroupAction.value == 'update') {
  //   recursionReloadTreeNode(treeData.value, updateData.pid as string)
  // } else if (createGroupAction.value == 'create') {
  //   recursionAddTreeNode(updateData)
  // } else if (createGroupAction.value == 'updateDoc') {
  //   recursionReloadTreeNode(treeData.value, updateData.pid as string)
  // }
}

function recursionReloadTreeNodeV1(arr: Array<TreeOption>, action: string, updateData: TreeOption): void {
  console.log(arguments)
  if (arr.length <= 0 || !updateData) {
    return
  }

  if (updateData.pid as string === 'root') {
    if (action == 'update') {
      console.log('update')
    } else if (action == 'updateDoc') {
      console.log('updateDoc')
    } else if (action == 'createDoc' || action == 'create') {
      let foundDoc = false
      for (let i = 0; i < arr.length; i++) {
        if (treeData.value[i].groupType == 'doc') {
          foundDoc = true
          arr.splice(i, 0, updateData)
          break;
        }
      }
      if (!foundDoc) {
        arr.push(updateData)
      }
    }
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id === (updateData.pid as string)) {
      if (action === 'update') {
        for (let j = 0; j < arr[i].children!.length; j++) {
          if (arr[i].children![j].id === (updateData.id as string)) {
            arr[i].children!.splice(j, 1)
            console.log(arr[i])
            // recursionReloadTreeNodeV1(treeData.value, 'create', updateData)
            break
          }
        }
      } else if (action === 'create') {
        console.log('create', arr[i])
        if (!arr[i] || arr[i].children!.length <= 0) {
          arr[i].children?.push(updateData)
        } else {
          let foundDoc = false
          for (let j = 0; j < arr[i].children!.length; j++) {
            if (arr[i].children![j].groupType === 'doc') {
              foundDoc = true
              arr[i].children!.splice(j, 0, updateData)
              break;
            }
          }
          if (!foundDoc) {
            arr[i].children!.push(updateData)
          }
        }
      } else if (action == 'updateDoc') {
        for (let j = 0; j < arr[i].children!.length; j++) {
          if (arr[i].children![j].id === (updateData.id as string)) {
            arr[i].children!.splice(j, 1)
            console.log(arr[i])
            // recursionReloadTreeNodeV1(treeData.value, 'createDoc', updateData)
            break
          }
        }
      } else if (action == 'createDoc') {
        console.log(action)
        arr[i].children!.push(updateData)
      }

      console.log(action)
      break
    }
    recursionReloadTreeNodeV1(arr[i]?.children || [], action, updateData)
  }
}


// function recursionReloadTreeNode(arr: Array<TreeOption>, pId: string) {
//   if (!arr || arr.length <= 0 || !pId) {
//     return
//   }

//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i]?.id == pId) {
//       handleLoad(arr[i])
//       break
//     }
//     recursionReloadTreeNode(arr[i]?.children || [], pId)
//   }
// }

function recursionUpdateTreeNodeTitle(arr: Array<TreeOption>, key: string, title: string) {
  if (!arr || arr.length <= 0 || !key) {
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

  .title-header-wrapper {
    position: relative;

    .theme-button {
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      border: 1px solid rgb(224, 224, 230);
      padding: 4px 8px 3px;
      //border-radius: 12px;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      border-right: none;
      transition: all linear 0.2s;

      &:hover {
        //border-color: #36ad6a;
      }

      &.HoverThemeButton {
        right: 0;
      }
    }
  }

  .tree-wrapper {
    ::v-deep(.n-tree-node-content__text) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
