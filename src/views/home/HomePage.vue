<template>
  <div class="homePage-wrapper">
    <!-- <Header></Header> -->
    <n-layout has-sider class="menu-layout">
      <!-- left sidebar -->
      <n-layout-sider class="menu-sider" bordered collapse-mode="width" :collapsed-width="64" :width="280"
        :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false">
        <h3>treasure-doc</h3>
        <!-- user menu -->
        <n-menu v-model:value="activeKey" mode="horizontal" :options="horizontalMenuOptions"
          @update:value="topMenuUpdate" :icon-size="18" ref="topMenuRef" />
        <!-- <n-menu class="menu-menu" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
          :options="menuOptions" :indent="24" :render-label="renderMenuLabel" :default-value="route.path"
          :render-icon="renderMenuIcon" /> -->
        <!-- <n-divider /> -->
        <n-tree block-line :data="treeData" :on-load="handleLoad" :node-props="nodeProps" />
      </n-layout-sider>
      <!-- right sidebar -->
      <n-layout class="right">
        <router-view></router-view>
      </n-layout>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, Component, onMounted } from 'vue';
import { MenuOption, TreeOption, useMessage, NButton, } from 'naive-ui';
import { useRouter, RouterLink } from 'vue-router';
import SvgIcon from '../../components/public/SvgIcon.vue';
import { NIcon } from 'naive-ui';
import {
  EllipsisHorizontalCircleOutline as EllipsisHorizontalCircle,
  Pencil as Pen,
  SearchSharp as Search,
  MailOpen,
  ArrowForwardCircleSharp
} from '@vicons/ionicons5'
import myHttp from '@/api/treasure_axios';
import { getDocGroupTree } from "@/api/doc_group"
import { DocGroup } from '@/types/resource';
import { ArrowBack, Refresh, Menu, DocumentTextOutline, FolderOutline, CreateOutline } from '@vicons/ionicons5'
import { createDoc, updateDoc, getDoc } from "@/api/doc"
import { Doc } from "@/types/resource"

const router = useRouter();
const topMenuRef = ref(null)
const message = useMessage()
const treeData = ref<Array<any>>([])

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const horizontalMenuOptions: MenuOption[] = [
  {
    label: '',
    key: 'top-menu-message',
    icon: renderIcon(MailOpen)
  },
  {
    label: '',
    key: 'top-menu-search',
    icon: renderIcon(Search),
  },
  {
    // label: () =>
    //   h(
    //     RouterLink,
    //     {
    //       to: {
    //         name: 'Editor',
    //         params: { id: 0 }
    //       }
    //     }
    //   )
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
const menuOptions = [
  {
    label: '收藏',
    key: 'like',
    pathName: 'Collection',
    iconName: 'collect',
  },
  {
    label: '计划',
    key: 'plan',
    pathName: 'Plan',
    iconName: 'plan',
  },
  {
    label: '笔记',
    key: 'all-doc',
    pathName: 'Note',
    iconName: 'diary',
  },
];


function topMenuUpdate(key: string, item: MenuOption): void {
  console.log(key, item)
  switch (key) {
    case 'top-menu-write':
      console.log(menuOptions)
      console.log(topMenuRef)
      createDoc({
        content: "# a title",
        title: "# a title"
      } as Doc).then(res => {
        console.log(res.getData())
        router.push({ path: `/Editor/${res.getData().id}` })
      }).catch(err => {
        message.error(err)
      })
      return
    case 'login-out':
      myHttp.post({ url: '/api/user/logout', data: {} }).then(() => {
        router.push("/LogIn")
      })
      return
    default:
  }
}

const activeKey = ref<string | null>(null)
const collapsed = ref(false)


function renderMenuLabel(option: MenuOption) {
  if ('pathName' in option) {
    return h(
      RouterLink as Component,
      {
        to: {
          name: option.pathName,
        }
      },
      { default: () => option.label }
    );
  }
  return option.label as string;
}

function renderMenuIcon(option: MenuOption) {
  return option.iconName && h(SvgIcon as Component, { iconName: option.iconName });
}


onMounted(() => {
  getDocGroupTree(0, true).then((response) => {
    for (const e of response.data as Array<DocGroup>) {
      treeData.value.push(newTreeItem(e))
    }
  }).catch((err) => {
    message.error(err)
  })
})

function newTreeItem(d: DocGroup) {
  return {
    label: genTreeLab(d),
    key: d.id,
    isLeaf: docIsLeaf(d.groupType),
    id: d.id,
    suffix: () => getSuffixIcon(d.groupType),
    prefix: () => getPrefixIcon(d.groupType),
    docObj: d
  }
}

function getSuffixIcon(groupType: string) {
  switch (groupType) {
    case "doc":
      return
    default:
      return h(NIcon, null, { default: () => h(CreateOutline) })
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
  if (g.groupType == "doc") {
    return g.title
  }

  return `${g.title}(${g.childrenCount})`
}

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      const docObj = (option.docObj as DocGroup)
      if (docObj.groupType == "doc") {
        router.push({ path: `/Editor/${docObj.id}` })
      }
    },
  }
}


</script>


<style scoped lang='scss'>
@import "@/assets/style/helper";

.homePage-wrapper {
  height: 100%;

  >.menu-layout {
    height: 100%;

    .menu-sider {
      background: $menuBackground;

      h3 {
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: rgb(191, 141, 15);
        font-size: 16px;
        border-color: black;
        border-width: 1px;
        border-style: dashed;
        margin: 5px;
      }

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