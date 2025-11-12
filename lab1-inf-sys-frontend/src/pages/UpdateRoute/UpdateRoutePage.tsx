import { useParams, useNavigate } from "react-router-dom";
import { useGetRouteByIdQuery, useUpdateRouteMutation } from "../../features/routes/routesApi";
import { RouteForm, type RouteFormValues } from "../../components/routes/RouteForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useValidationModal } from "../../app/useValidationModal";

export default function UpdateRoutePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useGetRouteByIdQuery(Number(id));
    const [updateRoute] = useUpdateRouteMutation();

    const { errors, showModal, setShowModal, validateAndShow } = useValidationModal();

    if (isLoading) return <div className="text-center py-8">Загрузка...</div>;
    if (!data) return <div className="text-center text-red-500 py-8">Маршрут не найден</div>;

    const initialValues: RouteFormValues = {
        name: data.name,
        distance: data.distance,
        rating: data.rating,
        coordinatesId: undefined,
        coordinates: data.coordinates,
        from: data.from,
        to: data.to,
    };

    const handleSubmit = async (values: RouteFormValues) => {
        if (!validateAndShow(values)) return;

        try {
            await updateRoute({ id: Number(id), ...values } as any).unwrap();
            navigate(`/route/${id}`);
        } catch (err) {
            console.error("Ошибка при обновлении маршрута:", err);
            setShowModal(true);
        }
    };

    return (
        <>
            <RouteForm
                initialValues={initialValues}
                submitText="Сохранить изменения"
                onSubmit={handleSubmit}
            />

            {showModal && (
                <Modal
                    title="Ошибки валидации"
                    onClose={() => setShowModal(false)}
                    actions={
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Закрыть
                        </Button>
                    }
                >
                    <ul className="list-disc list-inside text-red-500">
                        {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </Modal>
            )}
        </>
    );
}
