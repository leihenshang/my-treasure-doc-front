import myHttp from "@/api/treasure_axios"
import { DocGroup } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"

export function getGroupList(pagination: PaginationWithSort = new PaginationWithSort()): Promise<TreasureResponseList<DocGroup>> {
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

export function getDocGroupTree(pid: string = '0', withDoc: boolean = false): Promise<TreasureResponse<DocGroup>> {
    return new Promise<TreasureResponse<DocGroup>>((resolve, reject) => {
        myHttp.get<TreasureResponse<DocGroup>>({
            url: '/api/doc-group/tree', params: {
                pid, withDoc: withDoc
            }
        }).then((response) => {
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
    return new Promise<TreasureResponse<DocGroup>>((resolve, reject) => {
        myHttp.post<DocGroup>({
            url: '/api/doc-group/delete', data: groupObj
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponse<DocGroup> = new TreasureResponse()
            resp.data = response.data
            resolve(resp)
        })

    })
}

export async function createGroup(groupObj: DocGroup) {
    return new Promise<TreasureResponse<DocGroup>>((resolve, reject) => {
        myHttp.post<DocGroup>({
            url: '/api/doc-group/create', data: groupObj
        }).then((response) => {
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
    return new Promise<TreasureResponse<DocGroup>>((resolve, reject) => {
        myHttp.post<DocGroup>({
            url: '/api/doc-group/update', data: groupObj
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponse<DocGroup> = new TreasureResponse()
            resp.data = response?.data
            resolve(resp)
        })

    })
}