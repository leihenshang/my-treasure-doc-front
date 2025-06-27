import myHttp from "@/api"
import { ROOT_GROUP } from "@/constants"
import { DocGroup } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"

export async function getGroupList(pagination: PaginationWithSort = new PaginationWithSort()): Promise<TreasureResponseList<DocGroup>> {
    return new Promise<TreasureResponseList<DocGroup>>((resolve, reject) => {
        myHttp.get<TreasureResponse<DocGroup>>({
            url: '/api/doc-group/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                orderBy: pagination.orderBy,
            }
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }

            resolve(response.data as TreasureResponseList<DocGroup>)
        })

    })
}

export async function getDocGroupTree(pid: string = 'root', withDoc: boolean = false): Promise<TreasureResponse<DocGroup>> {
    return myHttp.get<TreasureResponse<DocGroup>>({
        url: '/api/doc-group/tree', params: {
            pid, withDoc: withDoc
        }
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}
//根据文件夹名称获取路径
export const getGroupRoad = (id: string) => {
    return myHttp.get<TreasureResponse<DocGroup>>({
        url: '/api/doc-group/detail', params: {
            id,
        }
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function deleteGroup(groupObj: DocGroup) {
    return myHttp.post<TreasureResponse<DocGroup>>({
        url: '/api/doc-group/delete', data: groupObj
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function createGroup(groupObj: DocGroup) {
    if (!groupObj.pid) {
        groupObj.pid = ROOT_GROUP
    }
    return myHttp.post<TreasureResponse<DocGroup>>({
        url: '/api/doc-group/create', data: groupObj
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function updateGroup(groupObj: DocGroup) {
    return myHttp.post<TreasureResponse<DocGroup>>({
        url: '/api/doc-group/update', data: groupObj
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}
