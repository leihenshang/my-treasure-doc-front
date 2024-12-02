import { DocGroup } from '@/types/resource';
import {
    DocumentTextOutline,
    FolderOutline
} from '@vicons/ionicons5';
import {
    NIcon,
    TreeOption
} from 'naive-ui';
import { h } from 'vue';


function getPrefixIcon(groupType: string) {
    switch (groupType) {
        case "doc":
            return h(NIcon, { color: "#0e7a0d" }, { default: () => h(DocumentTextOutline) })
        default:
            return h(NIcon, { color: "#FCB334" }, { default: () => h(FolderOutline) })
    }
}

export function buildTreeItem(d: DocGroup): TreeOption {
    return {
        label: d.title,
        key: `${d.groupType}-${d.id}`,
        id: d.id,
        isLeaf: (() => {
            if (d.groupType == 'doc') {
                return true
            }
            console.log(d.isLeaf)
            if (d.isLeaf !== undefined && d.isLeaf) {
                return true
            }

            return false
        })(),
        groupType: d.groupType,
        prefix: () => getPrefixIcon(d.groupType),
        pid: d.pid
    }
}

