export interface BaseResource {
    id: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
}

export interface Doc extends BaseResource {
    title: string,
    content: string,
    version?: number,
    groupId?: string,
    isTop?: number,
    isPin?: number,
    isRecover?: boolean,
    groupPath?: Array<DocGroup>
    readOnly?: number,
}

export interface DocHistory extends BaseResource {
    title: string,
    content: string,
    docId: number,
}

export interface DocGroup extends BaseResource {
    title: string,
    groupType: string,
    pid?: string,
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
    docId: string,
    isTop?: number,
    priority?: 0,
    color?: string,
    icon?: string
}
