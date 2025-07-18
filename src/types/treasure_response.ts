const DefaultPageNum = 1;
const DefaultPageSize = 20;
const FilterId = "id";
const FilterCreatedAt = "createdAt";
const OrderBySortDesc = "desc";
const OrderBySortAsc = "asc";

class TreasureResponse<T> {
    constructor(
        public code: number = 0,
        public msg: string = "",
        public data?: TreasureResponseList<T> | T | Array<T>,
    ) {

    }

    getData(): T {
        return this.data as T
    }

    getDataList(): TreasureResponseList<T> {
        return this.data as TreasureResponseList<T>
    }
}

interface OrderBy {
    field: string,
    sort: string
}

class PaginationWithSort {
    constructor(
        public page: number = DefaultPageNum,
        public pageSize: number = DefaultPageSize,
        public total?: number,
        public orderBy?: string,
    ) {
        this.orderBy = `${FilterCreatedAt}_${OrderBySortDesc}`
    }
}


class TreasureResponseList<T> {
    constructor(
        public list: Array<T> = new Array<T>,
        public pagination?: PaginationWithSort
    ) {

    }

}


function GenTreasureResponse<T>(resp: unknown): TreasureResponse<T> {
    const res = resp as TreasureResponse<T>
    return new TreasureResponse<T>(res?.code, res?.msg, res?.data)
}


export { GenTreasureResponse, PaginationWithSort, TreasureResponse, TreasureResponseList };





