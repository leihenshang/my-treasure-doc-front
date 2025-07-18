import myHttp from "@/api"
import { Room } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"

export async function getRoomList(
    pagination: PaginationWithSort = new PaginationWithSort(),
): Promise<TreasureResponseList<Room>> {
    return new Promise<TreasureResponseList<Room>>((resolve, reject) => {
        myHttp.get<TreasureResponse<Room>>({
            url: '/api/room/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                orderBy: pagination.orderBy,
            }
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response.data as TreasureResponseList<Room>)
        })
    })
}

export async function getRoom(id: number | string = 0): Promise<TreasureResponse<Room>> {
    return myHttp.get<TreasureResponse<Room>>({
        url: '/api/room/detail',
        params: { id }
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function createRoom(doc: Room): Promise<TreasureResponse<Room>> {
    return myHttp.post<TreasureResponse<Room>>({
        url: '/api/room/create',
        data: doc
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function updateRoom(doc: Room): Promise<TreasureResponse<Room>> {
    return myHttp.post<TreasureResponse<Room>>({
        url: '/api/room/update',
        data: doc
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response)
        }
        return response
    })
}

export async function deleteRoom(doc: Room): Promise<TreasureResponse<Room>> {
    return myHttp.post<TreasureResponse<Room>>({
        url: '/api/room/delete',
        data: doc
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

