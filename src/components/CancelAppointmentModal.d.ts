interface Appointment {
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    patientId: string;
    professionalId: string;
}
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment;
    onSuccess?: () => void;
}
export default function CancelAppointmentModal({ isOpen, onClose, appointment, onSuccess }: ModalProps): import("react/jsx-runtime").JSX.Element | null;
export {};
