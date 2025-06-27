import myHttp from "@/api/service"
import { Note } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"


export function getNoteList(pagination: PaginationWithSort = new PaginationWithSort()): Promise<TreasureResponseList<Note>> {
    return new Promise<TreasureResponseList<Note>>((resolve, reject) => {
        myHttp.get<TreasureResponse<Note>>({
            url: '/api/note/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                orderBy: pagination.orderBy
            }
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response?.data as TreasureResponseList<Note>)
        })
    })
}

export function getNote(id: number | string = 0): Promise<TreasureResponse<Note>> {
    return myHttp.get<TreasureResponse<Note>>({
        url: '/api/note/detail', params: {
            id
        }
    })
}

export function createNote(note: Note): Promise<TreasureResponse<Note>> {
    return myHttp.post<TreasureResponse<Note>>({
        url: '/api/note/create', data: note
    })
}

export function updateNote(note: Note): Promise<TreasureResponse<Note>> {
    return myHttp.post<TreasureResponse<Note>>({
        url: '/api/note/update', data: note
    })
}

export function deleteNote(note: Note): Promise<TreasureResponse<Note>> {
    return myHttp.post<TreasureResponse<Note>>({
        url: '/api/note/delete', data: note
    })
}

