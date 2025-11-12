import { useState } from "react";
import { validateRoute } from "../utils/validators";

export function useValidationModal() {
    const [errors, setErrors] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    const validateAndShow = (values: any): boolean => {
        const errs = validateRoute(values);
        if (errs.length > 0) {
            setErrors(errs);
            setShowModal(true);
            return false;
        }
        return true;
    };

    return { errors, showModal, setShowModal, validateAndShow };
}
