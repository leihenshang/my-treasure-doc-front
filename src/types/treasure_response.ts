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

    getData() {
        return this.data as T
    }

    getDataList() {
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
        public total: number = 0,
        public orderBy: string = "",
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




export { PaginationWithSort, TreasureResponse, TreasureResponseList };





