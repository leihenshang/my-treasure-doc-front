export interface BaseResource {
    id: number,
    createTime?: string,
    updateTime?: string,
}

export interface Doc extends BaseResource {
    title: string,
    content: string,
    groupId?: number,
    isTop?: number,
    isFirst?: boolean
}

export interface DocGroup extends BaseResource {
    title: string,
    groupType: string,
    childrenCount?: number,
    children?: Array<DocGroup>
}

export interface LoginUser extends BaseResource {
    account: string
    password: string
    verifyCode: string
}