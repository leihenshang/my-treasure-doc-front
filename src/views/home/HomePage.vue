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

        <div class="room-title">
          <n-dropdown trigger="click" :options="roomOptions" @select="handleRoomSelect">
            <n-button icon-placement="right">
              <template #icon>
                <NIcon>
                  <MenuSharp />
                </NIcon>
              </template>
              {{ currentRoom?.name }}</n-button>
          </n-dropdown>
        </div>
        <n-collapse :default-expanded-names="['1', '2']" style="padding: 0 10px 0 0;">
          <n-collapse-item title="置顶文档" name="1">
            <n-tree v-show="topDocList.length > 0" block-line :data="topDocList" :node-props="nodeProps"
              :render-switcher-icon="renderSwitcherIcon" :selectable="false" />
          </n-collapse-item>
          <n-collapse-item title="我的文档" name="2">
            <n-tree class="tree-wrapper" :data="treeData" :on-load="handleLoad" :node-props="nodeProps"
              :render-suffix="treeNodeSuffix" :render-switcher-icon="renderSwitcherIcon"
              :default-expanded-keys="expandedKeys" draggable @drop="handleDrop" :selected-keys="selectedKeys"
              block-line selectable />
          </n-collapse-item>
        </n-collapse>
      </n-layout-sider>
      <n-layout-content class="right" :native-scrollbar="false" content-style="display: flex;width:100%; height:100%;">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </div>
  <CreateGroup v-model:show="showModal" v-model:update-group="updateGroup" v-model:action-name="createGroupAction"
    @updated="(updateData: TreeOption | DocGroup, prePid: string | undefined) => handleCreateGroup(updateData, prePid ?? '')">
  </CreateGroup>
  <SearchBox v-model:show="showSearchBox"></SearchBox>
  <DocRecycleBin v-model:show="showRecycleBinModal" v-on:refresh-doc=" refreshTopDocList(); refreshTree('');">
  </DocRecycleBin>
</template>

<script lang="ts" setup>
import { createDoc, deleteDoc, getDocList } from "@/api/doc";
import { deleteGroup, getDocGroupTree } from "@/api/doc_group";
import { getRoomList } from "@/api/room";
import { logOut, updateProfile } from "@/api/user";
import DocRecycleBin from '@/components/doc/DocRecycleBin.vue';
import CreateGroup from "@/components/home_page/CreateGroup.vue";
import HeaderToolList from "@/components/home_page/nav/HeaderToolList.vue";
import SearchBox from "@/components/home_page/SearchBox.vue";
import { ROOT_GROUP } from "@/constants";
import { ToolObj } from "@/home-page/nav-type";
import { useGlobalStore } from '@/stores/global';
import { useUserInfoStore } from '@/stores/user/user_info';
import { Doc, DocGroup, Room } from '@/types/resource';
import { buildTreeItem } from '@/utils/common';
import eventBus from '@/utils/event_bus';
import { FolderAddOutlined } from '@vicons/antd';
import { Delete24Filled } from "@vicons/fluent";
import {
  AddCircleOutline,
  ChevronForward,
  MenuOutline,
  MenuSharp,
  MoonSharp,
  Pencil as Pen,
  SunnySharp
} from '@vicons/ionicons5';
import { NButton, NButtonGroup, NDropdown, NIcon, NLayout, NTree, TreeDropInfo, TreeOption, useDialog, useMessage } from 'naive-ui';
import { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";
import { h, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const storeUserInfo = useUserInfoStore()
const dialog = useDialog()
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
const mouseOverSelectedMenuId = ref()
// let handleMouseOverFn: ReturnType<typeof setTimeout>
const isHoverThemeButton = ref(false)

const toolMenuList: ToolObj[] = [
  { type: 'icon', iconOrTextName: 'Search', props: 'search' },
  { type: 'icon', iconOrTextName: 'FolderOutline', props: 'addFolder' },
  { type: 'icon', iconOrTextName: 'PencilOutline', props: 'addNote' },
  { type: 'icon', iconOrTextName: 'Home', props: 'dashboard', },
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

const currentRoom = ref<Room>()
const roomOptions = ref<Array<DropdownMixedOption>>([])

const handleRoomSelect = (key: string) => {
  for (const room of rooms.value) {
    if (room.id === key) {
      currentRoom.value = room
      refreshTree(currentRoom.value?.id || '');

      updateProfile({
        id: storeUserInfo.userInfo.id,
        account: storeUserInfo.userInfo.account,
        currentRoomId: currentRoom.value?.id || '',
      }).then(() => {
        message.success('切换空间成功');
      }).then(() => {
        storeUserInfo.updateCurrentRoomId(currentRoom.value?.id || '');
      }).catch(err => {
        console.error(err);
        message.error('切换空间失败');
      });


      break
    }
  }
}

const rooms = ref<Array<Room>>([])

onMounted(() => {
  getRoomList({
    page: 1,
    pageSize: 1000,
  }).then((response) => {
    rooms.value = response.list
    roomOptions.value = response.list.map((room: Room) => ({
      label: room.name,
      key: room.id,
      icon: () => h(NIcon, null, { default: () => h(MoonSharp) }),
    }))

    let defaultRoom: Room | undefined = undefined
    for (const room of response.list) {
      if (userInfoStore.currentRoomId && userInfoStore.currentRoomId === room.id) {
        currentRoom.value = room
        break
      }
      if (room.isDefault) {
        defaultRoom = room
      }
    }

    if (currentRoom.value === undefined && defaultRoom) {
      currentRoom.value = defaultRoom
    }

    return response.list
  }).then((res) => {
    console.log('获取空间列表成功', res);
    refreshTree(currentRoom.value?.id || '');
    refreshTopDocList();
  }).catch(err => {
    console.error(err);
    message.error('获取空间列表失败');
  });


})


eventBus.on('updateDocTitle', (data: Doc) => {
  recursionUpdateTreeNodeTitle(treeData.value, data.id, data.title)
})

// eventBus.on('updateGroupName', (data: TreeOption) => {
//   recursionUpdateTreeNodeTitle(treeData.value, data.id as string, data.title as string)
// })

eventBus.on('updateTopDoc', () => {
  refreshTopDocList()
})


onBeforeUnmount(() => {
  eventBus.offAll('updateTopDoc')
  eventBus.offAll('updateDocTitle')
  eventBus.offAll('updateDocGroupName')
})

//获取节点的兄妹节点及节点本身的index
const findSiblingsAndIndex: (node: TreeOption, nodes?: TreeOption[]) => [TreeOption[], number] | [null, null] =
  (node, nodes) => {
    if (!nodes)
      return [null, null]
    for (let i = 0; i < nodes.length; ++i) {
      const siblingNode = nodes[i]
      if (siblingNode.key === node.key) {
        return [nodes, i]
      }
      const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
      if (siblings && index !== null)
        return [siblings, index]
    }
    return [null, null]
  }
//保存拖动后的位置


//拖动后的事件
function handleDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(dragNode, treeData.value)
  if (dragNodeSiblings === null || dragNodeIndex === null) return
  dragNodeSiblings.splice(dragNodeIndex, 1)
  if (dropPosition === 'inside') {
    if (node.children) {
      node.children.unshift(dragNode)
    } else {
      node.children = [dragNode]
    }
  } else {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, treeData.value)
    if (nodeSiblings === null || nodeIndex === null) return
    const spliceIndex = dropPosition === 'before' ? nodeIndex : nodeIndex + 1
    nodeSiblings.splice(spliceIndex, 0, dragNode)
  }
  treeData.value = Array.from(treeData.value)
}

//切换主题的位置
const hoverThemeButton = () => {
  isHoverThemeButton.value = true
}
const mouseleaveThemeButton = () => {
  isHoverThemeButton.value = false
}

// const override: TreeOverrideNodeClickBehavior = ({option}) => {
//   if (option.groupType === 'group') {
//     return 'toggleExpand'
//   }
//   return 'default'
// }


function renderSwitcherIcon() {
  return h(NIcon, null, { default: () => h(ChevronForward) })
}

const changeModal = (action: string, group?: DocGroup) => {
  showModal.value = true;
  createGroupAction.value = action
  updateGroup.value = { ...group as DocGroup }
};

const userInfoStore = useUserInfoStore()

function topMenuAction(key: string): void {
  const title = genDocTitle()
  if (key === 'addNote') {
    createDoc({
      id: '',
      content: `# ${title}`,
      title: title,
      groupId: ROOT_GROUP
    } as Doc).then(res => {
      const doc = res.data as Doc
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
      console.log(err)
      if (typeof err === "string") {
        message.error(err)
      } else {
        console.log(err)
      }
    })
  } else if (key === 'logOut') {
    logOut().then(() => {
      localStorage.removeItem('userInfo')
      userInfoStore.$reset()
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
    router.push({ path: '/Dashboard' })
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

function refreshTree(roomId: string) {
  treeData.value = []
  getDocGroupTree('root', true, roomId).then((response) => {
    if (!response.data) {
      return
    }
    (response.data as Array<DocGroup>).map((val) => {
      treeData.value.push(buildTreeItem(val))
    })
  }).catch((err) => {
    console.log(err)
    message.error(err)
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
    getDocGroupTree(node.id as string, true, currentRoom.value?.id || '').then((response) => {
      if (!response.data) {
        reject()
        return
      }
      const docGroupList = response.data as Array<DocGroup>
      const arr = new Array<TreeOption>()
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

let mouseLeaveTimer: ReturnType<typeof setTimeout> | null = null

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      selectedKeys.value = []
      selectedKeys.value.push(option.key as string)
      if (option.groupType == "doc") {
        router.push({ path: `/Editor/${option.id}` })
      }
    },
    onMouseover(e: MouseEvent) {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer)
        mouseLeaveTimer = null
      }
      mouseOverSelectedMenuId.value = option.id
      const target = e.target as HTMLElement
      if (target.className === 'n-tree-node-content__text') {
        const { clientWidth, scrollWidth, innerHTML } = target
        if (clientWidth < scrollWidth) target.title = innerHTML
      }
    },
    onMouseleave() {
      mouseLeaveTimer = setTimeout(() => {
        mouseOverSelectedMenuId.value = undefined
      }, 500) // 200ms延迟，可根据体验调整
    }
  }
}

const treeNodeSuffix = (info: { option: TreeOption, checked: boolean, selected: boolean }) => {
  if (mouseOverSelectedMenuId.value !== info.option.id) return
  return h(NButtonGroup, {
    size: "tiny",
  }, () => [
    h(
      NDropdown,
      {
        onMouseenter: () => {
          if (mouseLeaveTimer) {
            clearTimeout(mouseLeaveTimer)
            mouseLeaveTimer = null
          }
          mouseOverSelectedMenuId.value = info.option.id
        },
        onMouseleave: () => {
          mouseLeaveTimer = setTimeout(() => {
            mouseOverSelectedMenuId.value = undefined
          }, 500)
        },
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
        onSelect: (key: string) => {
          if (key === 'delete') {
            dialog.warning({
              title: '小心!',
              content: '你确定？',
              positiveText: '确定',
              negativeText: '取消',
              closeOnEsc: true,
              onPositiveClick: () => {
                recursionDeleteTreeNode(treeData.value, info.option.id as number)
              }
            })
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
            console.log('option', info.option);
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
          createDoc(newDoc).then(res => {
            const doc = res.data as Doc
            const op = buildTreeItem({
              id: doc.id,
              title: doc.title,
              groupType: "doc",
              pid: info.option.id,
            } as DocGroup)
            createOtherFolderOrNote(treeData.value, op)
            expandedKeys.value?.push(info.option.key as string)
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

function recursionDeleteTreeNode(arr: Array<TreeOption>, key: number) {
  if (!arr || arr.length <= 0 || !key) {
    return
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id == key) {
      const id = arr[i]?.id
      if ((arr[i].groupType as string) === 'doc') {
        deleteDoc({ id } as Doc).then(() => {
          refreshTopDocList();
          arr.splice(i, 1)
          if (route.params.id === id) {
            router.push({ path: `/Editor` })
          }
        }).catch(err => {
          message.error(err)
        })
      } else {
        deleteGroup({ id } as DocGroup).then(() => {
          arr.splice(i, 1)
          eventBus.emit('deleteDocGroup', key)
        }).catch(err => {
          message.error(err)
        })
      }
      break
    }
    recursionDeleteTreeNode(arr[i]?.children || [], key)
  }
}

function handleCreateGroup(updateData: TreeOption | DocGroup, prePid: string): void {
  prePid = prePid ?? '';
  if (createGroupAction.value == 'update') {
    recursionUpdateTreeNodeTitle(treeData.value, updateData.id as string, updateData.title as string)
  } else if (createGroupAction.value == 'create') {
    createNewFolder(treeData.value, updateData as TreeOption)
  } else if (createGroupAction.value == 'updateDoc') {
    updateDoc(treeData.value, updateData as TreeOption, prePid)
    // recursionReloadTreeNode(treeData.value, updateData.pid as string)
  }
  // recursionReloadTreeNodeV1(treeData.value, createGroupAction.value, updateData)

  // if (createGroupAction.value == 'update') {
  //   recursionReloadTreeNode(treeData.value, updateData.pid as string)
  // } else if (createGroupAction.value == 'create') {
  //   recursionAddTreeNode(updateData)
  // } else if (createGroupAction.value == 'updateDoc') {
  //   recursionReloadTreeNode(treeData.value, updateData.pid as string)
  // }
}

//更新笔记位置
const updateDoc = (arr: Array<TreeOption>, updateData: TreeOption, prePid: string) => {
  //删除原本位置上的数据
  const preParent = findTreeItemById(arr, prePid)
  if (preParent) {
    const preChildren = preParent.children
    if (!preChildren) return
    preChildren.forEach((item, index) => {
      if (item.id === updateData.id as string) preChildren?.splice(index, 1)
    })
  } else {
    arr.forEach((item, index) => {
      if (item.id === updateData.id as string) arr?.splice(index, 1)
    })
  }
  //移动到新的位置
  if (updateData.pid === 'root') {
    treeData.value.push(updateData)
  } else {
    createOtherFolderOrNote(arr, updateData)
  }
}

//根据id查找是节点数据
const findTreeItemById = (arr: Array<TreeOption>, id: string): TreeOption | undefined => {
  if (arr.length <= 0) return
  // console.log(arr,id);
  const parentArr = arr.map(item => {
    if (item.id === id) {
      // console.log('执行了id');
      return item
    } else if (item.children) {
      // console.log('执行了children');
      return findTreeItemById(item.children, id)
    }
  })
  return parentArr.filter(item => !!item)[0]
}
//获取新文件夹的index
const findLastFolderIndex = (children: TreeOption[], childLength: number) => {
  let index = -1
  for (let j = 0; j < childLength; j++) {
    if (children[j]?.groupType === 'doc') {
      index = j
      break;
    }
  }
  return index
}
//创建根目录的文件夹
const createRootFolder = (arr: Array<TreeOption>, updateData: TreeOption) => {
  const lastFolderIndex = findLastFolderIndex(arr, arr.length)
  if (lastFolderIndex >= 0) {
    arr?.splice(lastFolderIndex, 0, updateData)
  } else {
    arr?.push(updateData)
  }
}
//创建非根目录文件夹/笔记
const createOtherFolderOrNote = (arr: Array<TreeOption>, updateData: TreeOption) => {
  const parentId = updateData.pid
  const parent = findTreeItemById(arr, parentId as string)
  if (!parent) {
    return
  }
  const children = parent.children || []
  const childLength = children?.length || 0
  if (!childLength) {
    parent.isLeaf = false
    parent.children = [updateData]
  } else {
    const lastFolderIndex = findLastFolderIndex(children, childLength)
    if (lastFolderIndex >= 0 && updateData.groupType !== 'doc') {
      children?.splice(lastFolderIndex, 0, updateData)
    } else {
      children?.push(updateData)
    }
  }
}
//创建文件夹
const createNewFolder = (arr: Array<TreeOption>, updateData: TreeOption) => {
  if (updateData.pid === 'root') {
    createRootFolder(arr, updateData)
    return;
  }
  createOtherFolderOrNote(arr, updateData)
}

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
@use "/src/assets/style/helper.scss" as *;

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

.room-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin: 10px 0;
}
</style>
