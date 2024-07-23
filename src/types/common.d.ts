
type DocumentObj = {
    id: number,
    title: string,
    content: string
}

type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'