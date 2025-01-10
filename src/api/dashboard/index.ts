import myHttp from "@/api/treasure_axios"
import {TreasureResponse, TreasureResponseList} from "@/treasure_response";
import {Note} from "@/resource";

type GetDashboardListParams = {
    page: number,
    pageSize: number,
    orderBy: string,
    noteTypes: string,
}

export const $_getDashboardList:(params:GetDashboardListParams)=>Promise<TreasureResponseList<Note>> = (params)=>{
    return new Promise<TreasureResponseList<Note>>((resolve,reject)=>{
        {
            myHttp.get<TreasureResponse<Note>>({
                url:'/api/note/list',params:params
            }).then(res=>{
                if (res?.code) {
                    reject(res?.msg)
                }
                resolve(res?.data as TreasureResponseList<Note>)
            })
        }
    })
}

export const $_createNote:(params:Note)=>Promise<Note> = (params)=>{
    return new Promise<Note>((resolve,reject)=>{
        {
            myHttp.post<Note>({
                url: '/api/note/create', data: params
            }).then(res => {
                if (res?.code) {
                    reject(res?.msg)
                }
                resolve(res?.data as Note)
            })
        }
    })
}
export const $_updateNote:(params:Note)=>Promise<Note> = (params)=>{
    return new Promise<Note>((resolve,reject)=>{
        {
            myHttp.post<Note>({
                url: '/api/note/update', data: params
            }).then(res => {
                if (res?.code) {
                    reject(res?.msg)
                }
                resolve(res?.data as Note)
            })
        }
    })
}
export const $_getDashboardDetails:(params: { id:string })=>Promise<Note> = (params)=>{
    return new Promise<Note>((resolve,reject)=>{
        {
            myHttp.get<TreasureResponse<Note>>({
                url:'/api/note/detail',params:params
            }).then(res=>{
                if (res?.code) {
                    reject(res?.msg)
                }
                resolve(res?.data as Note)
            })
        }
    })
}
export const $_deleteNote:(params:{ id:string })=>Promise<{ id:string }> = (params)=>{
    return new Promise<{ id:string }>((resolve,reject)=>{
        {
            myHttp.post<{ id:string }>({
                url: '/api/note/delete', data: params
            }).then(res => {
                if (res?.code) {
                    reject(res?.msg)
                }
                resolve(res?.data as { id:string })
            })
        }
    })
}
