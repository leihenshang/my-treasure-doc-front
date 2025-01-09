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
