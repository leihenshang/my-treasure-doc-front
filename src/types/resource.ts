export interface Base {
    id: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
}

export interface Doc extends Base {
    title: string,
    content: string,
    version?: number,
    groupId?: string,
    isTop?: number,
    isPin?: number,
    isRecover?: boolean,
    groupPath?: Array<DocGroup>
    groupPathList?: Array<DocGroup>
    readOnly?: number,
}

export interface Room extends Base {
    name: string,
    userId: string,
    status: string,
    isDefault: number,
}

export interface DocHistory extends Base {
    title: string,
    content: string,
    docId: number,
}

export interface DocGroup extends Base {
    title: string,
    groupType: string,
    pid?: string,
    children?: Array<DocGroup>,
    isLeaf?: boolean,
}

export interface LoginUser extends Base {
    account: string
    email: string
    password: string
    rePassword?: string
    verifyCode: string
}

export interface Note extends Base {
    title: string,
    content: string,
    noteType: string,
    docId: string,
    isTop?: number,
    priority?: 0,
    color?: string,
    icon?: string
}

export interface UserInfo extends Base {
    nickname?: string,
    account: string,
    email?: string,
    password?: string,
    userType?: number,
    userStatus?: number,
    mobile?: string,
    avatar?: string,
    bio?: string,
    token?: string,
    currentRoomId?: string,
}

//实现可选属性
export type PartialByKeys<T, K extends keyof T> = {//K extends keyof T ，K继承了T中K对应属性的类型
    [P in K]?: T[P];
} & Pick<T, Exclude<keyof T, K>>; //Pick把除了可选属性的其他属性对象类型与可选属性对象类型合并
//将可选属性和属性值组合
export type Simplity<T> = { [P in keyof T]: T[P] }
//实现必填属性
export type RequiredByKeys<T, K extends keyof T> = {
    [P in K]-?: T[P]; //-号可以移除可选和只读readonly
} & Pick<T, Exclude<keyof T, K>>;

