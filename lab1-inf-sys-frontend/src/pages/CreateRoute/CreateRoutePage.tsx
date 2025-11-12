import { useNavigate } from "react-router-dom";
import { useCreateRouteMutation } from "../../features/routes/routesApi";
import { RouteForm, type RouteFormValues } from "../../components/routes/RouteForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useValidationModal } from "../../app/useValidationModal";

export default function CreateRoutePage() {
    const navigate = useNavigate();
    const [createRoute] = useCreateRouteMutation();
    const { errors, showModal, setShowModal, validateAndShow } = useValidationModal();

    const handleSubmit = async (values: RouteFormValues) => {
        if (!validateAndShow(values)) return;

        try {
            await createRoute(values as any).unwrap();
            navigate("/");
        } catch {
            setShowModal(true);
        }
    };

    return (
        <>
            <RouteForm submitText="Создать маршрут" onSubmit={handleSubmit} />
            {showModal && (
                <Modal
                    title="Ошибки валидации"
                    onClose={() => setShowModal(false)}
                    actions={<Button onClick={() => setShowModal(false)}>Закрыть</Button>}
                >
                    <ul className="list-disc list-inside text-red-500">
                        {errors.map((e, i) => (
                            <li key={i}>{e}</li>
                        ))}
                    </ul>
                </Modal>
            )}
        </>
    );
}
