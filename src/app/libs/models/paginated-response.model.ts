export interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}
