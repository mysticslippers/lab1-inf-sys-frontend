export interface CoordinatesDTO {
    id?: number | null;
    x: number;
    y: number;
}

export interface LocationDTO {
    id?: number | null;
    x?: number | null;
    y: number;
    z: number;
}

export interface RouteDTO {
    id?: number | null;
    name: string;
    coordinates: CoordinatesDTO;
    from: LocationDTO;
    to: LocationDTO;
    distance?: number | null;
    rating: number;
    creationDate?: string | null;
}
