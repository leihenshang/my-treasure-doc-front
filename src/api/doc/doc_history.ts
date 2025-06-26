import myHttp from "@/api/treasure_axios"
import { DocHistory } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"


export function getDocHistoryList(
    docId: number,
    pagination: PaginationWithSort = new PaginationWithSort(),
): Promise<TreasureResponseList<DocHistory>> {
    return new Promise<TreasureResponseList<DocHistory>>((resolve, reject) => {
        myHttp.get<TreasureResponse<DocHistory>>({
            url: '/api/doc-history/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                orderBy: pagination.orderBy,
                docId
            }
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response?.data as TreasureResponseList<DocHistory>)
        })
    })
}

export function getDocHistory(id: number | string = 0): Promise<TreasureResponse<DocHistory>> {
    return myHttp.get<TreasureResponse<DocHistory>>({
        url: '/api/doc-history/detail', params: {
            id
        }
    })
}


export function recoveryDoc(id: string): Promise<TreasureResponse<DocHistory>> {
    return myHttp.post<TreasureResponse<DocHistory>>({
        url: '/api/doc-history/recover', data: { id }
    })
}

