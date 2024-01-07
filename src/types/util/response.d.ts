module "console/util/response" {
    interface PageableSort {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    }
    
    interface Pageable {
        sort: PageableSort;
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        updated: boolean;
    }
    
    interface PageResponse<T> {
        content: Array<T>;
        pageable: Pageable;
        totalPages: number;
        totalElements: number;
        last: boolean;
        size: number;
        number: boolean;
        sort: PageableSort;
        numberOfElements: boolean;
        first: boolean;
        empty: boolean;
    }
}
