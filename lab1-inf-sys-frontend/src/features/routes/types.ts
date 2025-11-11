export interface Coordinates {
    x: number;
    y: number;
}

export interface Location {
    x: number;
    y: number;
    z: number;
}

export interface Route {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    from: Location;
    to: Location;
    distance: number | null;
    rating: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
