import myHttp from "@/api/treasure_axios"
import { TreasureResponse, TreasureResponseList, PaginationWithSort } from "@/types/treasure_response"
import { Note } from "@/types/resource"


export function getNoteList(pagination: PaginationWithSort = new PaginationWithSort()): Promise<TreasureResponseList<Note>> {
    return new Promise<TreasureResponseList<Note>>((resolve, reject) => {
        myHttp.get<TreasureResponse<Note>>({
            url: 'api/note/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                orderBy: pagination.orderBy
            }
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }

            const resp: TreasureResponseList<Note> = new TreasureResponseList()
            resp.list = response?.data?.list
            resp.pagination = response?.data?.pagination
            resolve(resp)
        })
    })
}

export function getNote(id: number | string = 0): Promise<TreasureResponse<Note>> {
    return new Promise<TreasureResponse<Note>>((resolve, reject) => {
        myHttp.get<TreasureResponse<Note>>({
            url: 'api/note/detail', params: {
                id
            }
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response)
        })
    })
}

export function createNote(note: Note): Promise<TreasureResponse<Note>> {
    return new Promise<TreasureResponse<Note>>((resolve, reject) => {
        myHttp.post<TreasureResponse<Note>>({
            url: 'api/note/create', data: note
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }
            const resp: TreasureResponse<Note> = new TreasureResponse()
            resp.data = response?.data
            resp.msg = response?.msg
            resp.code = response?.code
            resolve(resp)
        })
    })
}

export function updateNote(note: Note): Promise<TreasureResponse<Note>> {
    return new Promise<TreasureResponse<Note>>((resolve, reject) => {
        myHttp.post<TreasureResponse<Note>>({
            url: 'api/note/update', data: note
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }
            const resp: TreasureResponse<Note> = new TreasureResponse()
            resp.data = response?.data
            resp.msg = response?.msg
            resp.code = response?.code
            resolve(resp)
        })
    })
}

export function deleteNote(note: Note): Promise<TreasureResponse<Note>> {
    return new Promise<TreasureResponse<Note>>((resolve, reject) => {
        myHttp.post<TreasureResponse<Note>>({
            url: 'api/note/delete', data: note
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            }
            const resp: TreasureResponse<Note> = new TreasureResponse()
            resp.data = response?.data
            resp.msg = response?.msg
            resp.code = response?.code
            resolve(resp)
        })
    })
}

