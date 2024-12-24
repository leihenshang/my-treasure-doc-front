export type HandleSelectObj = {
    label: string,
    props: string,
    iconName: string,
    iconType?:string,
}
export type ToolObj = {
    type: 'text' | 'icon',
    iconOrTextName: string,
    props: string,
    HandleSelectList?: HandleSelectObj[]
}
