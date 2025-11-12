export const validateRoute = (route: any): string[] => {
    const errors: string[] = [];

    if (!route.name?.trim()) errors.push("Имя маршрута не может быть пустым.");
    if (!route.coordinates) errors.push("Не выбраны координаты.");
    if (!route.from || !route.to) errors.push("Не выбраны локации начала/конца.");
    if (route.distance != null && route.distance <= 1)
        errors.push("Дистанция должна быть больше 1.");
    if (route.rating <= 0) errors.push("Рейтинг должен быть больше 0.");

    return errors;
};

export const isValidCoordinates = (x: number, y: number): boolean =>
    y > -976 && x !== null && y !== null;

export const isValidLocation = (x: number, y: number, z: number): boolean =>
    [x, y, z].every((v) => v !== null && v !== undefined);
