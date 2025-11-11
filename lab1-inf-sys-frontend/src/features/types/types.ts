export interface CoordinatesDTO {
    id: number;
    x: number;
    y: number;
}

export interface LocationDTO {
    id: number;
    x: number;
    y: number;
    z: number;
}

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

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}