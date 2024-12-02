export interface BaseResource {
    id: number,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
}

export interface Doc extends BaseResource {
    title: string,
    content: string,
    groupId?: number,
    isTop?: number,
    isPin?: number,
    isRecover?: boolean
}

export interface DocHistory extends BaseResource {
    title: string,
    content: string,
    docId: number,
}

export interface DocGroup extends BaseResource {
    title: string,
    groupType: string,
    pid?: number,
    children?: Array<DocGroup>,
    isLeaf?: boolean,
}

export interface LoginUser extends BaseResource {
    account: string
    password: string
    verifyCode: string
}

export interface Note extends BaseResource {
    title: string,
    content: string,
    noteType: string,
    docId: number,
    isTop?: number,
    priority?: 0,
    color?: string,
    icon?: string
}
