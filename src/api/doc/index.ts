import myHttp from "@/api/service"
import { Doc } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"

export function getDocList(
    groupId: string,
    isTop: number = 0,
    recycleBin: boolean = false,
    keyword: string = '',
    pagination: PaginationWithSort = new PaginationWithSort(),
): Promise<TreasureResponseList<Doc>> {
    return new Promise<TreasureResponseList<Doc>>((resolve, reject) => {
        myHttp.get<TreasureResponse<Doc>>({
            url: '/api/doc/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                orderBy: pagination.orderBy,
                groupId: groupId,
                isTop: isTop,
                recycleBin: recycleBin ? 1 : 2,
                keyword: keyword
            }
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response.data as TreasureResponseList<Doc>)
        })
    })
}

export function getDoc(id: number | string = 0): Promise<TreasureResponse<Doc>> {
    return myHttp.get<TreasureResponse<Doc>>({
        url: '/api/doc/detail',
        params: { id }
    })
}

export function getGroupRoad(id: string | number): Promise<TreasureResponse<Doc>> {
    return myHttp.get<TreasureResponse<Doc>>({
        url: '/api/doc-group/detail',
        params: { id }
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export function createDoc(doc: Doc): Promise<TreasureResponse<Doc>> {
    return myHttp.post<TreasureResponse<Doc>>({
        url: '/api/doc/create',
        data: doc
    })
}

export function updateDoc(doc: Doc): Promise<TreasureResponse<Doc>> {
    return myHttp.post<TreasureResponse<Doc>>({
        url: '/api/doc/update',
        data: doc
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response)
        }
        return response
    })
}

export function deleteDoc(doc: Doc): Promise<TreasureResponse<Doc>> {
    return myHttp.post<TreasureResponse<Doc>>({
        url: '/api/doc/delete',
        data: doc
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export function recoverDoc(doc: Doc): Promise<TreasureResponse<Doc>> {
    return myHttp.post<TreasureResponse<Doc>>({
        url: '/api/doc/recover',
        data: doc
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

