import myHttp from "@/api/treasure_axios"
import { Doc } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"


export function getDocList(
    groupId: string = '0',
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
    return new Promise<TreasureResponse<Doc>>((resolve, reject) => {
        myHttp.get<TreasureResponse<Doc>>({
            url: '/api/doc/detail', params: {
                id
            }
        }).then((response: TreasureResponse<Doc>) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response)
        })
    })
}

export function createDoc(doc: Doc): Promise<TreasureResponse<Doc>> {
    return new Promise<TreasureResponse<Doc>>((resolve, reject) => {
        myHttp.post<Doc>({
            url: '/api/doc/create', data: doc
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }
            const resp: TreasureResponse<Doc> = new TreasureResponse()
            resp.data = response?.data
            resp.msg = response?.msg
            resp.code = response?.code
            resolve(resp)
        })
    })
}

export function updateDoc(doc: Doc): Promise<TreasureResponse<Doc>> {
    return new Promise<TreasureResponse<Doc>>((resolve, reject) => {
        myHttp.post<Doc>({
            url: '/api/doc/update', data: doc
        }).then((response) => {
            if (response?.code) {
                reject(response)
            }
            resolve(response)
        })
    })
}

export function deleteDoc(doc: Doc): Promise<TreasureResponse<Doc>> {
    return new Promise<TreasureResponse<Doc>>((resolve, reject) => {
        myHttp.post<Doc>({
            url: '/api/doc/delete', data: doc
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response)
        })
    })
}

