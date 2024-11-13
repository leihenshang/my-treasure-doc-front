import myHttp from "@/api/treasure_axios"
import { TreasureResponse, TreasureResponseList, PaginationWithSort } from "@/types/treasure_response"
import { DocGroup } from "@/types/resource"

export function getGroupList(pagination: PaginationWithSort = new PaginationWithSort()): Promise<TreasureResponseList<DocGroup>> {
    return new Promise<TreasureResponseList<DocGroup>>((resolve: any, reject: any) => {
        myHttp.get<TreasureResponse<DocGroup>>({
            url: '/api/doc-group/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                orderBy: pagination.orderBy,
            }
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponseList<DocGroup> = new TreasureResponseList()
            resp.list = response?.data?.list
            resp.pagination = response?.data?.pagination
            resolve(resp)
        })

    })
}

export function getDocGroupTree(pid: number = 0, withChildren: boolean = false): Promise<TreasureResponse<DocGroup>> {
    return new Promise<TreasureResponse<DocGroup>>((resolve: any, reject: any) => {
        myHttp.get<TreasureResponse<DocGroup>>({
            url: '/api/doc-group/tree', params: {
                pid, withChildren
            }
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponse<DocGroup> = new TreasureResponse()
            resp.data = response?.data
            resolve(resp)
        })

    })
}


export async function deleteGroup(groupObj: DocGroup) {
    return new Promise<TreasureResponse<DocGroup>>((resolve: any, reject: any) => {
        myHttp.post<TreasureResponse<DocGroup>>({
            url: '/api/doc-group/delete', data: groupObj
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponse<DocGroup> = new TreasureResponse()
            resp.data = response?.data
            resolve(resp)
        })

    })
}

export async function createGroup(groupObj: DocGroup) {
    return new Promise<TreasureResponse<DocGroup>>((resolve: any, reject: any) => {
        myHttp.post<TreasureResponse<DocGroup>>({
            url: '/api/doc-group/create', data: groupObj
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponse<DocGroup> = new TreasureResponse()
            resp.data = response?.data
            resolve(resp)
        })

    })
}

export async function updateGroup(groupObj: DocGroup) {
    return new Promise<TreasureResponse<DocGroup>>((resolve: any, reject: any) => {
        myHttp.post<TreasureResponse<DocGroup>>({
            url: '/api/doc-group/update', data: groupObj
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponse<DocGroup> = new TreasureResponse()
            resp.data = response?.data
            resolve(resp)
        })

    })
}