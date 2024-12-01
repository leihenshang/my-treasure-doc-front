import { Doc, DocGroup } from '@/types/resource';
import {
    NButton,
    NIcon,
    TreeOption,
    useMessage
} from 'naive-ui';
import { h, reactive, ref } from 'vue';
import {
    AddCircleOutline,
    ArrowForwardCircleSharp,
    ChevronForward,
    DocumentTextOutline,
    EllipsisHorizontalCircleOutline as EllipsisHorizontalCircle,
    FolderOutline,
    MenuOutline,
    Pencil as Pen,
    SearchSharp as Search
} from '@vicons/ionicons5';


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
        isLeaf: d.groupType == 'doc',
        groupType: d.groupType,
        prefix: () => getPrefixIcon(d.groupType),
        pid: d.pid
    }
}

