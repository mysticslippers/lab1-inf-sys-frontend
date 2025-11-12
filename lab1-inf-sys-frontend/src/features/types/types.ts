export interface Coordinates {
    x: number;
    y: number;
}

export interface Location {
    x: number;
    y: number;
    z: number;
}

export interface CoordinatesDTO extends Coordinates {
    id: number;
}

export interface LocationDTO extends Location {
    id: number;
}

export interface Route {
    id: number;
    name: string;
    coordinates: CoordinatesDTO;
    from: LocationDTO;
    to: LocationDTO;
    creationDate: string;
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