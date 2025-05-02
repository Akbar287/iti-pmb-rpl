export interface Pagination<T> {
    data: T
    page: number
    limit: number
    totalElement: number
    totalPage: number
    isFirst: boolean
    isLast: boolean
    hasNext: boolean
    hasPrevious: boolean
}
